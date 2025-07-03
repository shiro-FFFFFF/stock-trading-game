import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { StockData } from '../types';

interface StockChartProps {
  data: StockData[];
  selectedStock: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, selectedStock }) => {
  const chartData = data.map(stock => ({
    date: format(stock.timestamp, 'MM/dd/yyyy'),
    price: stock.close,
    volume: stock.volume,
    fullDate: stock.timestamp
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: '#1a1a1a', 
          padding: '12px', 
          border: '1px solid #333', 
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ color: '#4fc3f7', fontWeight: 'bold' }}>{`Date: ${label}`}</p>
          <p style={{ color: '#fff' }}>{`Price: $${payload[0].value.toFixed(2)}`}</p>
          <p style={{ color: '#ccc' }}>{`Volume: ${payload[0].payload.volume.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4fc3f7', marginBottom: '0.5rem' }}>
          {selectedStock} Price Chart
        </h3>
        <p style={{ color: '#ccc', fontSize: '0.875rem' }}>
          Showing {chartData.length} trading days
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="date" 
            stroke="#ccc" 
            fontSize={12}
            tick={{ fill: '#ccc' }}
          />
          <YAxis 
            stroke="#ccc" 
            fontSize={12}
            tick={{ fill: '#ccc' }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#4fc3f7" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#4fc3f7' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart; 