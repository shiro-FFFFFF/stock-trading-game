export interface StockData {
  symbol: string;
  name: string;
  price: number;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Portfolio {
  cash: number;
  stocks: { [symbol: string]: number };
  totalValue: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  total: number;
}

export interface GameState {
  currentDate: Date;
  startDate: Date;
  endDate: Date;
  portfolio: Portfolio;
  transactions: Transaction[];
  isPlaying: boolean;
  speed: number;
  availableStocks: string[];
}

export interface HistoricalData {
  [symbol: string]: StockData[];
}

export interface ChartData {
  date: string;
  price: number;
  volume: number;
} 