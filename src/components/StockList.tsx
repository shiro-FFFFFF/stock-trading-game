import React from 'react';
import { GameState } from '../types';
import { StockDataService } from '../services/stockData';

interface StockListProps {
  gameState: GameState;
  selectedStock: string;
  onStockSelect: (symbol: string) => void;
}

const StockList: React.FC<StockListProps> = ({ gameState, selectedStock, onStockSelect }) => {
  const stockDataService = StockDataService.getInstance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="stock-list">
      <h3>Available Stocks</h3>
      
      {gameState.availableStocks.map(symbol => {
        const currentPrice = stockDataService.getCurrentPrice(symbol, gameState.currentDate);
        const stockName = stockDataService.getStockName(symbol);
        const isSelected = symbol === selectedStock;
        
        return (
          <div
            key={symbol}
            className={`stock-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onStockSelect(symbol)}
            style={{
              background: isSelected ? '#2a2a2a' : 'transparent',
              border: isSelected ? '1px solid #4fc3f7' : 'none'
            }}
          >
            <div>
              <div className="stock-symbol">{symbol}</div>
              <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                {stockName}
              </div>
            </div>
            <div className="stock-price">
              {formatCurrency(currentPrice)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StockList; 