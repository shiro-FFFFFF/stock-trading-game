# Stock Trading Game

A historical stock market trading simulator built with React and TypeScript. Test your trading strategies by simulating trades on real historical data from 2020-2023.

## Features

- **Historical Data Simulation**: Trade on real historical stock data from major companies
- **Time Control**: Start from any date and fast-forward through time to test strategies
- **Portfolio Management**: Track your cash, holdings, and performance
- **Interactive Charts**: Visualize stock price movements with interactive charts
- **Real-time Trading**: Buy and sell stocks with real-time price updates
- **Performance Tracking**: Monitor total returns and daily changes
- **Transaction History**: View all your trading activities

## Available Stocks

- **AAPL** - Apple Inc.
- **GOOGL** - Alphabet Inc.
- **MSFT** - Microsoft Corp.
- **AMZN** - Amazon.com Inc.
- **TSLA** - Tesla Inc.
- **META** - Meta Platforms Inc.
- **NFLX** - Netflix Inc.
- **NVDA** - NVIDIA Corp.

## How to Play

1. **Select a Start Date**: Choose when you want to begin trading (2020-2023)
2. **Choose a Stock**: Select from the available stocks in the sidebar
3. **Make Trades**: Buy or sell stocks using the trading panel
4. **Control Time**: Use play/pause to auto-advance time, or fast-forward manually
5. **Monitor Performance**: Track your portfolio value and returns
6. **Test Strategies**: Try different trading strategies and see how they perform

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
npm run build
```

### Deploy to GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub Pages URL
2. Run the deploy command:

```bash
npm run deploy
```

## Technical Details

### Architecture

- **Frontend**: React with TypeScript
- **Charts**: Recharts for interactive stock charts
- **Data**: Simulated historical data based on real market trends
- **State Management**: React hooks for game state management
- **Styling**: Custom CSS with dark theme

### Key Components

- **StockChart**: Interactive price chart with tooltips
- **TradingPanel**: Buy/sell interface with validation
- **PortfolioSummary**: Portfolio value and performance metrics
- **StockList**: Available stocks with current prices
- **TransactionHistory**: Record of all trades

### Services

- **StockDataService**: Manages historical price data
- **GameLogicService**: Handles game state and trading logic

## Game Rules

- **Starting Capital**: $10,000
- **Trading Hours**: Monday-Friday (weekends are skipped)
- **Minimum Trade**: 1 share
- **No Short Selling**: Can only sell stocks you own
- **Real-time Prices**: Prices update as time advances

## Performance Metrics

- **Total Return**: Absolute gain/loss from starting capital
- **Total Return %**: Percentage gain/loss from starting capital
- **Day Change**: Daily portfolio value change
- **Day Change %**: Daily percentage change

## Future Enhancements

- [ ] Add more stocks and sectors
- [ ] Implement options trading
- [ ] Add market indicators and news events
- [ ] Leaderboard and score sharing
- [ ] Technical analysis tools
- [ ] Portfolio diversification metrics
- [ ] Risk management features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- Stock data patterns inspired by real market movements
- UI design inspired by modern trading platforms
- Chart visualization powered by Recharts library

---

**Happy Trading!** 📈💰

*Remember: Past performance doesn't guarantee future results. This is a simulation for educational purposes only.* 