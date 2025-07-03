import React from 'react';
import { Transaction } from '../types';
import { format } from 'date-fns';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="transactions">
      <h3>Transaction History</h3>
      
      {sortedTransactions.length === 0 ? (
        <p style={{ color: '#ccc', fontStyle: 'italic' }}>No transactions yet</p>
      ) : (
        sortedTransactions.slice(0, 10).map(transaction => (
          <div key={transaction.id} className="transaction-item">
            <div>
              <div>
                <span className={`transaction-type transaction-${transaction.type.toLowerCase()}`}>
                  {transaction.type}
                </span>
                <strong style={{ marginLeft: '0.5rem' }}>
                  {transaction.symbol}
                </strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                {transaction.quantity} shares @ {formatCurrency(transaction.price)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                {format(new Date(transaction.timestamp), 'MMM dd, yyyy')}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong 
                className={transaction.type === 'BUY' ? 'negative' : 'positive'}
              >
                {transaction.type === 'BUY' ? '-' : '+'}
                {formatCurrency(transaction.total)}
              </strong>
            </div>
          </div>
        ))
      )}
      
      {sortedTransactions.length > 10 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '0.5rem', 
          color: '#ccc', 
          fontSize: '0.9rem' 
        }}>
          Showing 10 most recent transactions
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 