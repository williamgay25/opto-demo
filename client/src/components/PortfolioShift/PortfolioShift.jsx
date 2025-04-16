// src/components/PortfolioShift/PortfolioShift.jsx
import './PortfolioShift.css';
import MetricCard from '../MetricCard/MetricCard';

const PortfolioShift = ({ metrics }) => {
  return (
    <div className="portfolio-shift dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Portfolio shift analysis</h2>
        
        <div className="portfolio-quartile">
          <span className="quartile-text">Top quartile, $25M</span>
          <span className="quartile-arrow">▼</span>
        </div>
      </div>
      
      <div className="metrics-container">
        <MetricCard 
          title="Return"
          value={metrics.return.value}
          change={metrics.return.change}
          isPositive={metrics.return.change >= 0}
          format="percent"
        />
        
        <MetricCard 
          title="Yield"
          value={metrics.yield.value}
          change={metrics.yield.change}
          isPositive={metrics.yield.change >= 0}
          format="percent"
        />
        
        <MetricCard 
          title="Volatility"
          value={metrics.volatility.value}
          change={metrics.volatility.change}
          isPositive={metrics.volatility.change < 0} // Lower volatility is better
          format="percent"
        />
      </div>
    </div>
  );
};

export default PortfolioShift;