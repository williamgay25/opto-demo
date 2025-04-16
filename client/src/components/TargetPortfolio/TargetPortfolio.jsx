// src/components/TargetPortfolio/TargetPortfolio.jsx
import './TargetPortfolio.css';

const TargetPortfolio = ({ privateData, publicData }) => {
  const renderChangeIndicator = (change) => {
    if (change === 0) return null;
    
    const isPositive = change > 0;
    
    return (
      <span className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{change.toFixed(1)}%
      </span>
    );
  };
  
  const renderAllocationItem = (item, itemIndex, isCategory = false) => {
    return (
      <div key={itemIndex} className={`allocation-item ${isCategory ? 'category-item' : ''}`}>
        <div className="allocation-item-left">
          {isCategory ? (
            <span className="category-dot" style={{backgroundColor: getCategoryColor(item.name)}}></span>
          ) : null}
          
          <span className="allocation-name">{item.name}</span>
        </div>
        
        <div className="allocation-item-right">
          <span className="allocation-value">{item.value.toFixed(1)}%</span>
          {renderChangeIndicator(item.change)}
        </div>
      </div>
    );
  };
  
  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'Venture capital - early stage': '#205e6e',
      'Private equity - buyout': '#2a7d8c',
      'Real estate - value add': '#4fb0c4',
      'Real estate - core': '#8dd1e1',
      'Public bonds': '#5b9bd5',
      'Public equities': '#a5c8ed'
    };
    
    return colorMap[categoryName] || '#6c757d';
  };
  
  return (
    <div className="target-portfolio dashboard-section">
      <h2 className="section-title">Target portfolio</h2>
      
      <div className="strategies-header">
        <span>Strategies</span>
        <span>Weight</span>
      </div>
      
      {/* Private Section */}
      <div className="allocation-section">
        <div className="allocation-category">
          <span>Private</span>
          <div className="allocation-category-right">
            <span className="allocation-value">{privateData.total.toFixed(1)}%</span>
            {renderChangeIndicator(10.0)} {/* Hardcoded from the image */}
          </div>
        </div>
        
        {privateData.categories.map((item, index) => 
          renderAllocationItem(item, index, true)
        )}
      </div>
      
      {/* Public Section */}
      <div className="allocation-section">
        <div className="allocation-category">
          <span>Public</span>
          <div className="allocation-category-right">
            <span className="allocation-value">{publicData.total.toFixed(1)}%</span>
            {renderChangeIndicator(10.0)} {/* Hardcoded from the image */}
          </div>
        </div>
        
        {publicData.categories.map((item, index) => 
          renderAllocationItem(item, index, true)
        )}
      </div>
    </div>
  );
};

export default TargetPortfolio;