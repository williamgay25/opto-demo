// src/components/MetricCard/MetricCard.jsx
import './MetricCard.css';

const formatValue = (value, format) => {
  switch (format) {
    case 'percent':
      return `${value}%`;
    case 'currency':
      return `$${value}`;
    default:
      return value;
  }
};

const MetricCard = ({ title, value, change, isPositive, format = 'default', info = null }) => {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {info && <span className="metric-info">ℹ️</span>}
      </div>
      
      <div className="metric-value-container">
        <span className="metric-value">{formatValue(value, format)}</span>
        
        {change !== undefined && change !== 0 && (
          <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
            <span className="change-arrow">
              {isPositive ? '↑' : '↓'}
            </span>
            <span className="change-value">
              {change}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;