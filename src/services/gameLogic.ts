import { GameState, Portfolio, Transaction, StockData } from '../types';
import { StockDataService } from './stockData';

export class GameLogicService {
  private stockDataService: StockDataService;

  constructor() {
    this.stockDataService = StockDataService.getInstance();
  }

  public createInitialGameState(): GameState {
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2023-12-31');
    
    return {
      currentDate: new Date(startDate),
      startDate,
      endDate,
      portfolio: {
        cash: 10000,
        stocks: {},
        totalValue: 10000
      },
      transactions: [],
      isPlaying: false,
      speed: 1,
      availableStocks: this.stockDataService.getAvailableStocks()
    };
  }

  public buyStock(gameState: GameState, symbol: string, quantity: number): GameState {
    const currentPrice = this.stockDataService.getCurrentPrice(symbol, gameState.currentDate);
    const totalCost = currentPrice * quantity;

    if (totalCost > gameState.portfolio.cash) {
      throw new Error('Insufficient funds');
    }

    const newPortfolio = {
      ...gameState.portfolio,
      cash: gameState.portfolio.cash - totalCost,
      stocks: {
        ...gameState.portfolio.stocks,
        [symbol]: (gameState.portfolio.stocks[symbol] || 0) + quantity
      }
    };

    const transaction: Transaction = {
      id: Date.now().toString(),
      symbol,
      type: 'BUY',
      quantity,
      price: currentPrice,
      timestamp: new Date(gameState.currentDate),
      total: totalCost
    };

    return {
      ...gameState,
      portfolio: {
        ...newPortfolio,
        totalValue: this.calculatePortfolioValue(newPortfolio, gameState.currentDate)
      },
      transactions: [...gameState.transactions, transaction]
    };
  }

  public sellStock(gameState: GameState, symbol: string, quantity: number): GameState {
    const currentHoldings = gameState.portfolio.stocks[symbol] || 0;
    
    if (quantity > currentHoldings) {
      throw new Error('Insufficient shares');
    }

    const currentPrice = this.stockDataService.getCurrentPrice(symbol, gameState.currentDate);
    const totalRevenue = currentPrice * quantity;

    const newPortfolio = {
      ...gameState.portfolio,
      cash: gameState.portfolio.cash + totalRevenue,
      stocks: {
        ...gameState.portfolio.stocks,
        [symbol]: currentHoldings - quantity
      }
    };

    // Remove stock from portfolio if quantity becomes 0
    if (newPortfolio.stocks[symbol] === 0) {
      delete newPortfolio.stocks[symbol];
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      symbol,
      type: 'SELL',
      quantity,
      price: currentPrice,
      timestamp: new Date(gameState.currentDate),
      total: totalRevenue
    };

    return {
      ...gameState,
      portfolio: {
        ...newPortfolio,
        totalValue: this.calculatePortfolioValue(newPortfolio, gameState.currentDate)
      },
      transactions: [...gameState.transactions, transaction]
    };
  }

  public advanceTime(gameState: GameState, days: number = 1): GameState {
    const newDate = new Date(gameState.currentDate);
    newDate.setDate(newDate.getDate() + days);

    // Don't advance past end date
    if (newDate > gameState.endDate) {
      newDate.setTime(gameState.endDate.getTime());
    }

    // Skip weekends
    while (newDate.getDay() === 0 || newDate.getDay() === 6) {
      newDate.setDate(newDate.getDate() + 1);
      if (newDate > gameState.endDate) {
        newDate.setTime(gameState.endDate.getTime());
        break;
      }
    }

    const updatedPortfolio = {
      ...gameState.portfolio,
      totalValue: this.calculatePortfolioValue(gameState.portfolio, newDate)
    };

    return {
      ...gameState,
      currentDate: newDate,
      portfolio: updatedPortfolio
    };
  }

  public setGameSpeed(gameState: GameState, speed: number): GameState {
    return {
      ...gameState,
      speed: Math.max(1, Math.min(10, speed))
    };
  }

  public togglePlayPause(gameState: GameState): GameState {
    return {
      ...gameState,
      isPlaying: !gameState.isPlaying
    };
  }

  public resetGame(gameState: GameState, newStartDate?: Date): GameState {
    const startDate = newStartDate || gameState.startDate;
    
    return {
      ...gameState,
      currentDate: new Date(startDate),
      startDate,
      portfolio: {
        cash: 10000,
        stocks: {},
        totalValue: 10000
      },
      transactions: [],
      isPlaying: false,
      speed: 1
    };
  }

  private calculatePortfolioValue(portfolio: Portfolio, date: Date): number {
    let totalValue = portfolio.cash;

    Object.entries(portfolio.stocks).forEach(([symbol, quantity]) => {
      const price = this.stockDataService.getCurrentPrice(symbol, date);
      totalValue += price * quantity;
    });

    return totalValue;
  }

  public getPortfolioPerformance(gameState: GameState): {
    totalReturn: number;
    totalReturnPercent: number;
    dayChange: number;
    dayChangePercent: number;
  } {
    const initialValue = 10000;
    const currentValue = gameState.portfolio.totalValue;
    const totalReturn = currentValue - initialValue;
    const totalReturnPercent = (totalReturn / initialValue) * 100;

    // Calculate day change
    const previousDate = new Date(gameState.currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    
    // Skip weekends for previous date
    while (previousDate.getDay() === 0 || previousDate.getDay() === 6) {
      previousDate.setDate(previousDate.getDate() - 1);
    }

    const previousValue = this.calculatePortfolioValue(gameState.portfolio, previousDate);
    const dayChange = currentValue - previousValue;
    const dayChangePercent = previousValue > 0 ? (dayChange / previousValue) * 100 : 0;

    return {
      totalReturn,
      totalReturnPercent,
      dayChange,
      dayChangePercent
    };
  }
} 