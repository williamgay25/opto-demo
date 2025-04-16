// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import PortfolioShift from '../../components/PortfolioShift/PortfolioShift';
import ProjectedValue from '../../components/ProjectedValue/ProjectedValue';
import AssetAllocation from '../../components/AssetAllocation/AssetAllocation';
import HistoricalAnalysis from '../../components/HistoricalAnalysis/HistoricalAnalysis';
import TargetPortfolio from '../../components/TargetPortfolio/TargetPortfolio';
import './Dashboard.css';

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = import.meta.env.VITE_BACKEND_URL + '/portfolio-data';
        
        const response = await fetch(url);
        const data = await response.json();
        setPortfolioData(data);
        console.log('Portfolio data loaded from backend');
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };
  
    fetchData();
  }, []);

  if (!portfolioData) {
    return (
      <div className="dashboard">
        <p className="loading-message">Loading portfolio data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header portfolioType={portfolioData.portfolioType} portfolioData={portfolioData} />
      
      <div className="dashboard-content">
        <div className="left-column">
          <PortfolioShift metrics={portfolioData.metrics} />
          
          <ProjectedValue 
            currentData={portfolioData.projectedValue.current} 
            targetData={portfolioData.projectedValue.target} 
          />
          
          <HistoricalAnalysis data={portfolioData.historical_scenarios} />
        </div>
        
        <div className="right-column">
          <AssetAllocation data={portfolioData.assetAllocation} />
          
          <TargetPortfolio 
            privateData={portfolioData.assetAllocation.private} 
            publicData={portfolioData.assetAllocation.public} 
          />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;