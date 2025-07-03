import React from 'react';
import { GameState } from '../types';
import { StockDataService } from '../services/stockData';

interface PortfolioSummaryProps {
  gameState: GameState;
  performance: {
    totalReturn: number;
    totalReturnPercent: number;
    dayChange: number;
    dayChangePercent: number;
  };
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ gameState, performance }) => {
  const stockDataService = StockDataService.getInstance();

  const getColorClass = (value: number) => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="portfolio-summary">
      <h3>Portfolio Summary</h3>
      
      <div className="portfolio-item">
        <strong>Total Value:</strong>
        <span>{formatCurrency(gameState.portfolio.totalValue)}</span>
      </div>
      
      <div className="portfolio-item">
        <strong>Cash:</strong>
        <span>{formatCurrency(gameState.portfolio.cash)}</span>
      </div>
      
      <div className="portfolio-item">
        <strong>Total Return:</strong>
        <span className={getColorClass(performance.totalReturn)}>
          {formatCurrency(performance.totalReturn)} ({formatPercent(performance.totalReturnPercent)})
        </span>
      </div>
      
      <div className="portfolio-item">
        <strong>Day Change:</strong>
        <span className={getColorClass(performance.dayChange)}>
          {formatCurrency(performance.dayChange)} ({formatPercent(performance.dayChangePercent)})
        </span>
      </div>

      <div className="portfolio-holdings">
        <h4 style={{ color: '#4fc3f7', marginTop: '1rem', marginBottom: '0.5rem' }}>Holdings</h4>
        {Object.keys(gameState.portfolio.stocks).length === 0 ? (
          <p style={{ color: '#ccc', fontStyle: 'italic' }}>No stocks held</p>
        ) : (
          Object.entries(gameState.portfolio.stocks).map(([symbol, quantity]) => {
            const currentPrice = stockDataService.getCurrentPrice(symbol, gameState.currentDate);
            const currentValue = currentPrice * quantity;
            const stockName = stockDataService.getStockName(symbol);
            
            return (
              <div key={symbol} className="portfolio-item">
                <div>
                  <strong>{symbol}</strong>
                  <br />
                  <small style={{ color: '#ccc' }}>
                    {quantity} shares @ {formatCurrency(currentPrice)}
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>{formatCurrency(currentValue)}</strong>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PortfolioSummary; 