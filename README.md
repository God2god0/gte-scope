# GteScope - Token Analysis Tool

A modern token analysis platform that helps you analyze new token launches and make informed decisions. Built with a clean, professional interface similar to GTE.xyz.

## What it does

- **Token Search**: Find any token by name or contract address
- **Bundle Detection**: Track wallet connections and bundle analysis
- **Sniper Detection**: Detect suspicious early buying patterns
- **Price Charts**: Interactive 24-hour price visualization
- **Detailed Analytics**: Wallet distribution, volatility, MDD, liquidity signals
- **Social Links**: Direct access to Twitter and website
- **Trading Calculator**: Liquidation price and TP/SL calculator for leveraged positions


## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the dev server:
```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser

## How to use

1. Enter a token name or contract address in the search bar
2. Click "Analyze" to get detailed insights
3. Review the results:
   - Token info and price chart
   - Bundle wallet analysis
   - Sniper detection alerts
   - Wallet distribution
   - Volatility and maximum drawdown
   - Liquidity signals

## Trading Calculator

The platform includes two powerful calculators:

### Liquidation Price Calculator
- Calculate liquidation prices for long/short positions
- Support for 2x to 100x leverage
- Real-time calculations with maintenance margin
- Shows both liquidation and bankruptcy prices

### TP/SL Calculator
- Set take profit and stop loss targets
- Calculate potential gains/losses
- Dynamic percentage calculations based on collateral
- Liquidation warnings for risky positions

## Analysis Criteria

### Bundle Detection
- Track wallet connections and relationships
- Analyze bundle wallet distribution
- Monitor coordinated buying patterns
- Identify potential manipulation groups

### Sniper Detection
- Detect suspicious early buying patterns
- Single wallet >30% volume in first minute → red flag
- Monitor rapid large transactions
- Alert on coordinated sniper activity

### Wallet Distribution
- Analyze top wallet holders
- Track wallet concentration
- Monitor wallet connections
- Identify potential bundle groups

### Volatility & MDD
σ/µ (variability) and maximum drawdown analysis

### Liquidity Signal
First day TVL/liquidity direction: "adding or removing?"

## Data Sources

- **Primary**: CoinGecko API for real-time token data
- **Fallback**: Mock data generation for testing
- **Price History**: 24-hour candlestick data
- **Market Data**: Volume, market cap, price changes

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── TokenInfo.jsx
│   ├── PriceChart.jsx
│   ├── AnalyticsPanel.jsx
│   ├── Leaderboard.jsx
│   └── LoadingSpinner.jsx
├── services/           # API services
│   └── api.js
├── App.jsx            # Main application
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

## Disclaimer

This tool is for educational and research purposes only. It is not financial advice. Always do your own research before making any investment decisions. Trading cryptocurrencies involves substantial risk of loss.