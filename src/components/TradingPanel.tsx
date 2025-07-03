import React, { useState } from 'react';
import { GameState } from '../types';

interface TradingPanelProps {
  gameState: GameState;
  selectedStock: string;
  currentPrice: number;
  onBuy: (symbol: string, quantity: number) => void;
  onSell: (symbol: string, quantity: number) => void;
  error?: string;
}

const TradingPanel: React.FC<TradingPanelProps> = ({
  gameState,
  selectedStock,
  currentPrice,
  onBuy,
  onSell,
  error
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const currentHoldings = gameState.portfolio.stocks[selectedStock] || 0;
  const totalCost = currentPrice * quantity;
  const canBuy = totalCost <= gameState.portfolio.cash;
  const canSell = quantity <= currentHoldings;

  const handleTrade = () => {
    if (tradeType === 'buy' && canBuy) {
      onBuy(selectedStock, quantity);
    } else if (tradeType === 'sell' && canSell) {
      onSell(selectedStock, quantity);
    }
  };

  const maxBuyQuantity = Math.floor(gameState.portfolio.cash / currentPrice);
  const maxSellQuantity = currentHoldings;

  return (
    <div className="trading-panel">
      <h3>Trading Panel</h3>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="trading-form">
        <div className="form-group">
          <label>Stock: {selectedStock}</label>
          <div className="stock-info">
            <span className="stock-price">Current Price: ${currentPrice.toFixed(2)}</span>
            <span className="holdings">Holdings: {currentHoldings} shares</span>
          </div>
        </div>

        <div className="form-group">
          <label>Trade Type</label>
          <select 
            className="select"
            value={tradeType} 
            onChange={(e) => setTradeType(e.target.value as 'buy' | 'sell')}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            className="input"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max={tradeType === 'buy' ? maxBuyQuantity : maxSellQuantity}
          />
          <div className="quantity-info">
            <small>
              Max {tradeType === 'buy' ? 'Buy' : 'Sell'}: {' '}
              {tradeType === 'buy' ? maxBuyQuantity : maxSellQuantity} shares
            </small>
          </div>
        </div>

        <div className="form-group">
          <label>Total {tradeType === 'buy' ? 'Cost' : 'Revenue'}</label>
          <div className="total-cost">
            ${totalCost.toFixed(2)}
          </div>
        </div>

        <div className="trade-actions">
          <button
            className={`btn ${tradeType === 'buy' ? 'btn-success' : 'btn-danger'}`}
            onClick={handleTrade}
            disabled={
              !selectedStock || 
              quantity <= 0 || 
              (tradeType === 'buy' && !canBuy) ||
              (tradeType === 'sell' && !canSell) ||
              currentPrice === 0
            }
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {quantity} shares
          </button>
        </div>

        <div className="quick-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setQuantity(Math.floor(maxBuyQuantity / 4))}
            disabled={tradeType === 'sell' || maxBuyQuantity < 4}
          >
            25% Cash
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setQuantity(Math.floor(maxBuyQuantity / 2))}
            disabled={tradeType === 'sell' || maxBuyQuantity < 2}
          >
            50% Cash
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setQuantity(Math.floor(maxSellQuantity / 2))}
            disabled={tradeType === 'buy' || maxSellQuantity < 2}
          >
            50% Holdings
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setQuantity(maxSellQuantity)}
            disabled={tradeType === 'buy' || maxSellQuantity === 0}
          >
            All Holdings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel; 