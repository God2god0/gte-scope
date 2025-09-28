# GteScope - Token Analysis Tool

A modern token analysis platform that helps you analyze new token launches and make informed decisions. Built with a clean, professional interface similar to GTE.xyz.

## What it does

- **Token Search**: Find any token by name or contract address
- **Fair Launch Score**: Get a reliability score from 0-100
- **Sniper Alerts**: Detect suspicious early buying patterns
- **Price Charts**: Interactive 24-hour price visualization
- **Detailed Analytics**: Top10 buyer share, volatility, MDD, liquidity signals
- **Social Links**: Direct access to Twitter and website
- **Trading Calculator**: Liquidation price and TP/SL calculator for leveraged positions

## Tech Stack

- **Frontend**: React 18 + Vite
- **UI**: Material-UI with custom glassmorphism design
- **Charts**: Chart.js with react-chartjs-2
- **Data**: Real-time data from CoinGecko API
- **Styling**: Modern CSS with gradient effects

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
   - Fair launch score (A+ to D rating)
   - Sniper alert status
   - Top10 buyer concentration
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

### Fair Launch Score (0-100)

**A) Buyer Concentration (0-40 points)**
- Top10 buyer share in first 60 minutes
- Sniper activity in first minute
- Unique buyer count

**B) LP Behavior (0-35 points)**
- Initial LP ratio
- Lock/burn status
- 24h LP withdrawals
- Tax/blacklist transparency

**C) Price Stability (0-25 points)**
- 24h volatility (σ/µ)
- Maximum drawdown (MDD)
- Volume/depth signals

### Sniper Alert
Single wallet >30% volume in first minute → red flag

### Top10 Buyer Share
Percentage of total "net buys" from Top10 wallets in first 60 minutes

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