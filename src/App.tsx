import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

import { GameState } from './types';
import { GameLogicService } from './services/gameLogic';
import { StockDataService } from './services/stockData';

import StockChart from './components/StockChart';
import TradingPanel from './components/TradingPanel';
import PortfolioSummary from './components/PortfolioSummary';
import StockList from './components/StockList';
import TransactionHistory from './components/TransactionHistory';

import './styles/index.css';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [error, setError] = useState<string>('');
  const [gameLogic] = useState(() => new GameLogicService());
  const [stockDataService] = useState(() => StockDataService.getInstance());

  useEffect(() => {
    const initialState = gameLogic.createInitialGameState();
    setGameState(initialState);
  }, [gameLogic]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState?.isPlaying) {
      interval = setInterval(() => {
        setGameState(prevState => {
          if (!prevState) return prevState;
          
          const newState = gameLogic.advanceTime(prevState, 1);
          if (newState.currentDate >= newState.endDate) {
            return gameLogic.togglePlayPause(newState);
          }
          return newState;
        });
      }, 1000 / (gameState.speed || 1));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState?.isPlaying, gameState?.speed, gameLogic]);

  const handleBuy = (symbol: string, quantity: number) => {
    if (!gameState) return;
    
    try {
      const newState = gameLogic.buyStock(gameState, symbol, quantity);
      setGameState(newState);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSell = (symbol: string, quantity: number) => {
    if (!gameState) return;
    
    try {
      const newState = gameLogic.sellStock(gameState, symbol, quantity);
      setGameState(newState);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleTogglePlayPause = () => {
    if (!gameState) return;
    
    const newState = gameLogic.togglePlayPause(gameState);
    setGameState(newState);
  };

  const handleSpeedChange = (speed: number) => {
    if (!gameState) return;
    
    const newState = gameLogic.setGameSpeed(gameState, speed);
    setGameState(newState);
  };

  const handleReset = () => {
    if (!gameState) return;
    
    const newState = gameLogic.resetGame(gameState);
    setGameState(newState);
    setError('');
  };

  const handleDateChange = (newDate: Date) => {
    if (!gameState) return;
    
    const newState = gameLogic.resetGame(gameState, newDate);
    setGameState(newState);
    setError('');
  };

  const handleFastForward = (days: number) => {
    if (!gameState) return;
    
    const newState = gameLogic.advanceTime(gameState, days);
    setGameState(newState);
  };

  if (!gameState) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const currentPrice = stockDataService.getCurrentPrice(selectedStock, gameState.currentDate);
  const chartData = stockDataService.getHistoricalData(
    selectedStock,
    new Date(gameState.currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    gameState.currentDate
  );
  const performance = gameLogic.getPortfolioPerformance(gameState);

  return (
    <div className="app">
      <header className="header">
        <h1>Stock Trading Game</h1>
      </header>

      <main className="main-content">
        <div className="game-area">
          <div className="controls">
            <div className="date-display">
              {format(gameState.currentDate, 'MMMM dd, yyyy')}
            </div>

            <div className="control-group">
              <label>Start Date:</label>
              <input
                type="date"
                className="input"
                value={format(gameState.startDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                max={format(new Date('2023-12-31'), 'yyyy-MM-dd')}
                min={format(new Date('2020-01-01'), 'yyyy-MM-dd')}
              />
            </div>

            <div className="control-group">
              <button
                className="btn btn-primary"
                onClick={handleTogglePlayPause}
                disabled={gameState.currentDate >= gameState.endDate}
              >
                {gameState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {gameState.isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>

            <div className="control-group">
              <label>Speed:</label>
              <select
                className="select"
                value={gameState.speed}
                onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
              >
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="5">5x</option>
                <option value="10">10x</option>
              </select>
            </div>

            <div className="control-group">
              <button
                className="btn btn-secondary"
                onClick={() => handleFastForward(7)}
                disabled={gameState.isPlaying}
              >
                <FastForward size={16} />
                +1 Week
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleFastForward(30)}
                disabled={gameState.isPlaying}
              >
                <FastForward size={16} />
                +1 Month
              </button>
            </div>

            <div className="control-group">
              <button
                className="btn btn-danger"
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          <StockChart 
            data={chartData} 
            selectedStock={selectedStock} 
          />
        </div>

        <div className="sidebar">
          <PortfolioSummary 
            gameState={gameState} 
            performance={performance} 
          />

          <TradingPanel
            gameState={gameState}
            selectedStock={selectedStock}
            currentPrice={currentPrice}
            onBuy={handleBuy}
            onSell={handleSell}
            error={error}
          />

          <StockList
            gameState={gameState}
            selectedStock={selectedStock}
            onStockSelect={setSelectedStock}
          />

          <TransactionHistory 
            transactions={gameState.transactions} 
          />
        </div>
      </main>
    </div>
  );
};

export default App; 