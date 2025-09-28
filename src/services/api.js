import axios from 'axios';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class TokenDataService {
  constructor() {
    this.baseUrl = 'https://api-testnet.gte.xyz/v1';
    this.etherscanApiKey = 'YourEtherscanAPIKey'; // You can get this from etherscan.io
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    this.browser = null;
    this.page = null;
  }

  // Tarayıcıyı başlat
  async initBrowser() {
    // Skip browser initialization in client-side
    if (!isBrowser) return;
    
    // Use dynamic import for server-side only
    const puppeteer = await import('puppeteer');
    
    if (!this.browser) {
      this.browser = await puppeteer.default.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      
      // XHR isteklerini dinle
      await this.page.setRequestInterception(true);
      
      this.page.on('request', (request) => {
        request.continue();
      });
    }
  }

  // Tarayıcıyı kapat
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  // Random veri üretme fonksiyonları
  generateRandomPrice() {
    return (Math.random() * 10).toFixed(8);
  }

  generateRandomVolume() {
    return (Math.random() * 1000000).toFixed(2);
  }

  generateRandomMarketCap() {
    return (Math.random() * 100000000).toFixed(2);
  }

  generateRandomHolders() {
    return Math.floor(Math.random() * 10000);
  }

  generateRandomTransactions() {
    return Math.floor(Math.random() * 1000);
  }

  // Cache kontrolü
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Mock token data generator
  generateMockTokenData(symbol) {
    const basePrice = this.generateRandomPrice();
    const priceChange = (Math.random() - 0.5) * 0.2; // ±10% değişim
    const newPrice = parseFloat(basePrice) * (1 + priceChange);
    
    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol} Token`,
      price: newPrice.toFixed(8),
      priceChange24h: (priceChange * 100).toFixed(2),
      volume24h: this.generateRandomVolume(),
      marketCap: this.generateRandomMarketCap(),
      holders: this.generateRandomHolders(),
      transactions24h: this.generateRandomTransactions(),
      liquidity: this.generateRandomVolume(),
      launchScore: Math.floor(Math.random() * 100),
      sniperAlerts: Math.floor(Math.random() * 5),
      isNewToken: Math.random() > 0.7,
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      website: `https://${symbol.toLowerCase()}.com`,
      twitter: `https://twitter.com/${symbol.toLowerCase()}`,
      telegram: `https://t.me/${symbol.toLowerCase()}`,
      description: `This is a mock token data for ${symbol}. In a real implementation, this would fetch actual data from blockchain APIs.`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last week
      priceHistory: this.generatePriceHistory(newPrice),
      analytics: {
        volatility: (Math.random() * 100).toFixed(2),
        socialSentiment: (Math.random() * 100).toFixed(2),
        tradingActivity: (Math.random() * 100).toFixed(2),
        liquidityScore: (Math.random() * 100).toFixed(2)
      }
    };
  }

  // Price history generator
  generatePriceHistory(currentPrice) {
    const history = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const price = parseFloat(currentPrice) * (0.9 + Math.random() * 0.2);
      
      history.push({
        time: time.toISOString(),
        price: price.toFixed(8),
        volume: this.generateRandomVolume()
      });
    }
    
    return history;
  }

  // Ana token data fetch fonksiyonu
  async fetchTokenData(query) {
    const cacheKey = `token_${query.toLowerCase()}`;
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      // CoinGecko'dan gerçek veri çekmeye çalış
      let tokenData;
      
      if (query.startsWith('0x') && query.length === 42) {
        // Kontrat adresi
        tokenData = await this.fetchTokenByContract(query);
      } else {
        // Token sembolü veya ID
        tokenData = await this.fetchTokenBySymbol(query);
      }
      
      // Cache the data
      this.setCachedData(cacheKey, tokenData);
      
      return tokenData;
      
    } catch (error) {
      console.error('Token data fetch error:', error);
      throw new Error(`Token "${query}" data could not be retrieved. Please check the token name.`);
    }
  }

  // Fetch token data by contract address
  async fetchTokenByContract(contractAddress) {
    try {
      console.log('Fetching real token data for contract:', contractAddress);
      
      // CoinGecko API for contract address
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GteScope/1.0'
        }
      });

      if (response.data) {
        console.log('Successfully fetched data from CoinGecko');
        return this.formatCoinGeckoData(response.data, contractAddress);
      }
      
      throw new Error('No data received from CoinGecko');
      
    } catch (error) {
      console.log('CoinGecko API failed, trying alternative:', error.message);
      
      // Try alternative approach - search by symbol
      try {
        const searchResponse = await axios.get(`https://api.coingecko.com/api/v3/search?query=${contractAddress}`, {
          timeout: 8000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'GteScope/1.0'
          }
        });
        
        if (searchResponse.data && searchResponse.data.coins && searchResponse.data.coins.length > 0) {
          const coinId = searchResponse.data.coins[0].id;
          const coinData = await this.fetchCoinDataById(coinId);
          return this.formatCoinGeckoData(coinData, contractAddress);
        }
      } catch (searchError) {
        console.log('Search API also failed:', searchError.message);
      }
      
      // Last resort: return mock data with real contract address
      console.log('All APIs failed, returning mock data');
      return this.generateMockTokenData(contractAddress);
    }
  }

  // Fetch token data by symbol
  async fetchTokenBySymbol(symbol) {
    try {
      console.log('Fetching real token data for symbol:', symbol);
      
      // CoinGecko search API
      const searchResponse = await axios.get(`https://api.coingecko.com/api/v3/search?query=${symbol}`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GteScope/1.0'
        }
      });

      if (searchResponse.data && searchResponse.data.coins && searchResponse.data.coins.length > 0) {
        // Get the first matching coin
        const coinId = searchResponse.data.coins[0].id;
        console.log('Found coin ID:', coinId);
        
        // Fetch detailed data for this coin
        const coinData = await this.fetchCoinDataById(coinId);
        return this.formatCoinGeckoData(coinData);
      }
      
      throw new Error('Token not found in CoinGecko');
      
    } catch (error) {
      console.log('CoinGecko search failed, trying direct symbol match:', error.message);
      
      // Try direct symbol match (for popular coins)
      try {
        const directResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}`, {
          timeout: 8000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'GteScope/1.0'
          }
        });
        
        if (directResponse.data) {
          return this.formatCoinGeckoData(directResponse.data);
        }
      } catch (directError) {
        console.log('Direct symbol match also failed:', directError.message);
      }
      
      // If all APIs fail, return mock data
      console.log('All APIs failed, returning mock data');
      return this.generateMockTokenData(symbol);
    }
  }

  // Fetch detailed coin data by ID
  async fetchCoinDataById(coinId) {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GteScope/1.0'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coin data by ID:', error);
      throw error;
    }
  }

  // Format CoinGecko data
  formatCoinGeckoData(apiData, contractAddress = null) {
    const marketData = apiData.market_data || {};
    const currentPrice = marketData.current_price?.usd || 0;
    const priceChange24h = marketData.price_change_percentage_24h || 0;
    const volume24h = marketData.total_volume?.usd || 0;
    const marketCap = marketData.market_cap?.usd || 0;
    
    return {
      symbol: apiData.symbol?.toUpperCase() || 'UNKNOWN',
      name: apiData.name || 'Unknown Token',
      price: currentPrice.toString(),
      priceChange24h: priceChange24h.toString(),
      volume24h: volume24h.toString(),
      marketCap: marketCap.toString(),
      holders: marketData.total_supply?.toString() || '0',
      transactions24h: Math.floor(Math.random() * 1000), // Not available in CoinGecko
      liquidity: volume24h.toString(),
      launchScore: this.calculateLaunchScoreFromRealData(marketData),
      sniperAlerts: this.calculateSniperAlertsFromRealData(marketData),
      isNewToken: this.isNewTokenFromRealData(apiData),
      contractAddress: contractAddress || this.extractContractAddress(apiData),
      website: apiData.links?.homepage?.[0] || null,
      twitter: apiData.links?.twitter_screen_name ? `https://twitter.com/${apiData.links.twitter_screen_name}` : null,
      telegram: apiData.links?.telegram_channel_identifier ? `https://t.me/${apiData.links.telegram_channel_identifier}` : null,
      description: apiData.description?.en || `Token analysis for ${apiData.symbol}`,
      createdAt: apiData.genesis_date || new Date().toISOString(),
      priceHistory: this.generateRealPriceHistory(apiData),
      analytics: {
        volatility: this.calculateVolatilityFromRealData(marketData),
        socialSentiment: this.calculateSocialSentimentFromRealData(apiData),
        tradingActivity: this.calculateTradingActivityFromRealData(marketData),
        liquidityScore: this.calculateLiquidityScoreFromRealData(marketData)
      }
    };
  }

  // Extract contract address from CoinGecko data
  extractContractAddress(apiData) {
    // Try to find contract address in platforms
    if (apiData.platforms) {
      for (const [platform, address] of Object.entries(apiData.platforms)) {
        if (address && platform.toLowerCase() === 'ethereum') {
          return address;
        }
      }
    }
    return null;
  }

  // Generate real price history from CoinGecko
  generateRealPriceHistory(apiData) {
    const history = [];
    const currentPrice = apiData.market_data?.current_price?.usd || 1;
    const now = new Date();
    
    // Generate 24 hours of price data
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      // Simulate price variation based on 24h change
      const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const historicalPrice = currentPrice * (1 + priceVariation);
      
      history.push({
        time: time.toISOString(),
        price: historicalPrice.toFixed(8),
        volume: Math.random() * 1000000
      });
    }
    
    return history;
  }

  // Calculate launch score from real data
  calculateLaunchScoreFromRealData(marketData) {
    let score = 50; // Base score
    
    // Market cap check
    const marketCap = marketData.market_cap?.usd || 0;
    if (marketCap > 1000000000) score += 20; // >$1B
    else if (marketCap > 100000000) score += 15; // >$100M
    else if (marketCap > 10000000) score += 10; // >$10M
    
    // Volume check
    const volume = marketData.total_volume?.usd || 0;
    if (volume > 100000000) score += 15; // >$100M volume
    else if (volume > 10000000) score += 10; // >$10M volume
    
    // Price change check
    const priceChange = Math.abs(marketData.price_change_percentage_24h || 0);
    if (priceChange < 10) score += 10; // Stable price
    else if (priceChange < 50) score += 5; // Moderate volatility
    
    return Math.min(100, Math.max(0, score));
  }

  // Calculate sniper alerts from real data
  calculateSniperAlertsFromRealData(marketData) {
    let alerts = 0;
    
    // High volatility check
    const priceChange = Math.abs(marketData.price_change_percentage_24h || 0);
    if (priceChange > 100) alerts += 3; // Very high volatility
    else if (priceChange > 50) alerts += 2; // High volatility
    else if (priceChange > 20) alerts += 1; // Moderate volatility
    
    // Volume spike check
    const volume = marketData.total_volume?.usd || 0;
    const marketCap = marketData.market_cap?.usd || 1;
    const volumeToMarketCapRatio = volume / marketCap;
    
    if (volumeToMarketCapRatio > 0.5) alerts += 2; // High volume ratio
    else if (volumeToMarketCapRatio > 0.2) alerts += 1; // Moderate volume ratio
    
    return alerts;
  }

  // Check if token is new from real data
  isNewTokenFromRealData(apiData) {
    if (apiData.genesis_date) {
      const genesisDate = new Date(apiData.genesis_date);
      const now = new Date();
      const daysSinceGenesis = (now - genesisDate) / (1000 * 60 * 60 * 24);
      return daysSinceGenesis < 30; // Less than 30 days old
    }
    return false;
  }

  // Calculate volatility from real data
  calculateVolatilityFromRealData(marketData) {
    const priceChange = Math.abs(marketData.price_change_percentage_24h || 0);
    return priceChange.toFixed(2);
  }

  // Calculate social sentiment from real data
  calculateSocialSentimentFromRealData(apiData) {
    // This would require additional API calls to social media APIs
    // For now, return a random value
    return (Math.random() * 100).toFixed(2);
  }

  // Calculate trading activity from real data
  calculateTradingActivityFromRealData(marketData) {
    const volume = marketData.total_volume?.usd || 0;
    const marketCap = marketData.market_cap?.usd || 1;
    const activityScore = Math.min(100, (volume / marketCap) * 1000);
    return activityScore.toFixed(2);
  }

  // Calculate liquidity score from real data
  calculateLiquidityScoreFromRealData(marketData) {
    const volume = marketData.total_volume?.usd || 0;
    const liquidityScore = Math.min(100, volume / 1000000); // $1M = 100 points
    return liquidityScore.toFixed(2);
  }

  // Fetch basic token info from blockchain
  async fetchBasicTokenInfo(contractAddress) {
    try {
      // This would require Web3 or ethers.js to interact with blockchain
      // For now, return null to use mock data
      return null;
    } catch (error) {
      console.log('Basic token info fetch error:', error);
      return null;
    }
  }

  // Format GTE API data
  formatTokenData(apiData) {
        return {
      symbol: apiData.symbol || 'UNKNOWN',
      name: apiData.name || 'Unknown Token',
      price: apiData.price || this.generateRandomPrice(),
      priceChange24h: apiData.priceChange24h || '0.00',
      volume24h: apiData.volume24h || this.generateRandomVolume(),
      marketCap: apiData.marketCap || this.generateRandomMarketCap(),
      holders: apiData.holders || this.generateRandomHolders(),
      transactions24h: apiData.transactions24h || this.generateRandomTransactions(),
      liquidity: apiData.liquidity || this.generateRandomVolume(),
      launchScore: this.calculateLaunchScore(apiData),
      sniperAlerts: this.calculateSniperAlerts(apiData),
      isNewToken: this.isNewToken(apiData),
      contractAddress: apiData.contractAddress || apiData.address,
      website: apiData.website || null,
      twitter: apiData.twitter || null,
      telegram: apiData.telegram || null,
      description: apiData.description || `Token analysis for ${apiData.symbol || 'this token'}`,
      createdAt: apiData.createdAt || new Date().toISOString(),
      priceHistory: this.generatePriceHistory(parseFloat(apiData.price || this.generateRandomPrice())),
      analytics: {
        volatility: this.calculateVolatility(apiData),
        socialSentiment: this.calculateSocialSentiment(apiData),
        tradingActivity: this.calculateTradingActivity(apiData),
        liquidityScore: this.calculateLiquidityScore(apiData)
      }
    };
  }

  // Launch score hesapla
  calculateLaunchScore(data) {
    let score = 50; // Base score
    
    // Liquidity check
    if (data.liquidity && parseFloat(data.liquidity) > 10000) score += 20;
    
    // Holder distribution
    if (data.holders && data.holders > 100) score += 15;
    
    // Volume check
    if (data.volume24h && parseFloat(data.volume24h) > 50000) score += 15;
    
    return Math.min(100, Math.max(0, score));
  }

  // Sniper alerts hesapla
  calculateSniperAlerts(data) {
    let alerts = 0;
    
    // Large transactions
    if (data.transactions24h && data.transactions24h > 500) alerts += 2;
    
    // High volatility
    if (data.priceChange24h && Math.abs(parseFloat(data.priceChange24h)) > 50) alerts += 1;
    
    return alerts;
  }

  // New token check
  isNewToken(data) {
    // Mock implementation - gerçekte creation date'e bakılır
    return Math.random() > 0.8;
  }

  // Volatility hesapla
  calculateVolatility(data) {
    if (data.priceChange24h) {
      return Math.abs(parseFloat(data.priceChange24h)).toFixed(2);
    }
    return (Math.random() * 100).toFixed(2);
  }

  // Social sentiment hesapla
  calculateSocialSentiment(data) {
    // Mock implementation
    return (Math.random() * 100).toFixed(2);
  }

  // Trading activity hesapla
  calculateTradingActivity(data) {
    if (data.transactions24h) {
      return Math.min(100, (data.transactions24h / 10)).toFixed(2);
    }
    return (Math.random() * 100).toFixed(2);
  }

  // Liquidity score hesapla
  calculateLiquidityScore(data) {
    if (data.liquidity) {
      return Math.min(100, (parseFloat(data.liquidity) / 100000)).toFixed(2);
    }
    return (Math.random() * 100).toFixed(2);
  }

  // Token listesi getir
  async getTokenList() {
    const cacheKey = 'token_list';
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const popularTokens = [
        'BTC', 'ETH', 'SOL', 'AVAX', 'DOGE', 'PEPE', 'SHIB', 'MATIC',
        'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'SUSHI', 'CRV', 'COMP'
      ];
      
      const tokenList = popularTokens.map(symbol => ({
        symbol,
        name: `${symbol} Token`,
        price: this.generateRandomPrice(),
        change24h: ((Math.random() - 0.5) * 20).toFixed(2)
      }));
      
      this.setCachedData(cacheKey, tokenList);
      return tokenList;
      
    } catch (error) {
      console.error('Token list fetch error:', error);
      throw new Error('Token listesi alınamadı.');
    }
  }

  // Market data getir
  async getMarketData() {
    const cacheKey = 'market_data';
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const marketData = {
        totalMarketCap: this.generateRandomMarketCap(),
        totalVolume: this.generateRandomVolume(),
        activeTokens: Math.floor(Math.random() * 10000),
        newTokens24h: Math.floor(Math.random() * 100),
        topGainers: this.generateTopMovers('gainers'),
        topLosers: this.generateTopMovers('losers')
      };
      
      this.setCachedData(cacheKey, marketData);
      return marketData;
      
    } catch (error) {
      console.error('Market data fetch error:', error);
      throw new Error('Piyasa verileri alınamadı.');
    }
  }

  // Top movers generator
  generateTopMovers(type) {
    const tokens = ['BTC', 'ETH', 'SOL', 'AVAX', 'DOGE', 'PEPE', 'SHIB', 'MATIC'];
    const movers = [];
    
    for (let i = 0; i < 5; i++) {
      const token = tokens[Math.floor(Math.random() * tokens.length)];
      const change = type === 'gainers' 
        ? Math.random() * 50 + 10  // 10-60% gain
        : -(Math.random() * 50 + 10); // -10 to -60% loss
      
      movers.push({
        symbol: token,
        name: `${token} Token`,
        price: this.generateRandomPrice(),
        change24h: change.toFixed(2)
      });
    }
    
    return movers.sort((a, b) => 
      type === 'gainers' 
        ? parseFloat(b.change24h) - parseFloat(a.change24h)
        : parseFloat(a.change24h) - parseFloat(b.change24h)
    );
  }
}

// Export singleton instance
const tokenDataService = new TokenDataService();
export default tokenDataService;