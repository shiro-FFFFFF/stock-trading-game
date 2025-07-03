import { StockData, HistoricalData } from '../types';

export class StockDataService {
  private static instance: StockDataService;
  private historicalData: HistoricalData = {};

  private constructor() {
    this.generateHistoricalData();
  }

  public static getInstance(): StockDataService {
    if (!StockDataService.instance) {
      StockDataService.instance = new StockDataService();
    }
    return StockDataService.instance;
  }

  private generateHistoricalData(): void {
    const stocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', startPrice: 150 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', startPrice: 2500 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', startPrice: 300 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', startPrice: 3200 },
      { symbol: 'TSLA', name: 'Tesla Inc.', startPrice: 800 },
      { symbol: 'META', name: 'Meta Platforms Inc.', startPrice: 320 },
      { symbol: 'NFLX', name: 'Netflix Inc.', startPrice: 500 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', startPrice: 220 },
    ];

    const startDate = new Date('2020-01-01');
    const endDate = new Date('2024-01-01');
    const daysCount = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    stocks.forEach(stock => {
      const stockHistory: StockData[] = [];
      let currentPrice = stock.startPrice;
      
      for (let i = 0; i < daysCount; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) {
          continue;
        }

        // Generate realistic price movement
        const volatility = 0.02; // 2% daily volatility
        const trend = this.calculateTrend(stock.symbol, date);
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const priceChange = trend + randomChange;
        
        const open = currentPrice;
        const change = open * priceChange;
        const close = Math.max(0.01, open + change);
        
        // Generate high/low based on volatility
        const dayRange = Math.abs(change) * 2;
        const high = Math.max(open, close) + dayRange * Math.random();
        const low = Math.min(open, close) - dayRange * Math.random();
        
        const volume = Math.floor(Math.random() * 10000000) + 1000000;

        stockHistory.push({
          symbol: stock.symbol,
          name: stock.name,
          price: close,
          timestamp: date,
          open,
          high,
          low,
          close,
          volume
        });

        currentPrice = close;
      }

      this.historicalData[stock.symbol] = stockHistory;
    });
  }

  private calculateTrend(symbol: string, date: Date): number {
    // Simulate different market trends for different stocks
    const year = date.getFullYear();
    const month = date.getMonth();
    
    let baseTrend = 0;
    
    // Simulate tech boom/bust cycles
    if (symbol === 'TSLA') {
      if (year === 2020 || year === 2021) baseTrend = 0.001; // Bull run
      else if (year === 2022) baseTrend = -0.002; // Bear market
      else baseTrend = 0.0005;
    } else if (['AAPL', 'GOOGL', 'MSFT'].includes(symbol)) {
      if (year === 2020 && month >= 3) baseTrend = 0.0015; // COVID recovery
      else if (year === 2022) baseTrend = -0.001; // Interest rate hikes
      else baseTrend = 0.0008;
    } else {
      baseTrend = 0.0005; // Default modest growth
    }

    // Add some seasonal effects
    if (month === 11 || month === 0) baseTrend += 0.0003; // Holiday effect
    if (month === 8 || month === 9) baseTrend -= 0.0002; // September effect

    return baseTrend;
  }

  public getHistoricalData(symbol: string, startDate: Date, endDate: Date): StockData[] {
    const stockData = this.historicalData[symbol];
    if (!stockData) return [];

    return stockData.filter(data => 
      data.timestamp >= startDate && data.timestamp <= endDate
    );
  }

  public getCurrentPrice(symbol: string, date: Date): number {
    const stockData = this.historicalData[symbol];
    if (!stockData) return 0;

    // Find the closest trading day
    const closestData = stockData.find(data => 
      data.timestamp.toDateString() === date.toDateString()
    );

    if (closestData) return closestData.close;

    // If exact date not found, find the most recent trading day before the date
    const pastData = stockData.filter(data => data.timestamp <= date);
    if (pastData.length === 0) return stockData[0]?.close || 0;

    return pastData[pastData.length - 1].close;
  }

  public getAvailableStocks(): string[] {
    return Object.keys(this.historicalData);
  }

  public getStockName(symbol: string): string {
    const stockData = this.historicalData[symbol];
    return stockData?.[0]?.name || symbol;
  }
} 