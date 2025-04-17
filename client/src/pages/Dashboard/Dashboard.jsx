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
  const [isSimulation, setIsSimulation] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = import.meta.env.VITE_BACKEND_URL + '/portfolio-data';
        
        const response = await fetch(url);
        const data = await response.json();
        setPortfolioData(data);
        setOriginalData(data);
        console.log('Portfolio data loaded from backend');
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handlePortfolioUpdate = (update) => {
    if (!isSimulation) {
      setOriginalData({ ...portfolioData });
      setIsSimulation(true);
    }

    if (update.type === "simulation") {
      
      setPortfolioData(prevData => {
        const newData = { ...prevData };
  
        const mapping = {
          'venture_capital': 'Venture capital - early stage',
          'private_equity': 'Private equity - buyout',
          'real_estate_value': 'Real estate - value add',
          'real_estate_core': 'Real estate - core',
          'public_bonds': 'Public bonds',
          'public_equities': 'Public equities'
        };
        
        return newData;
      });
    }
  };

  const handleResetPortfolio = () => {
    if (isSimulation && originalData) {
      setPortfolioData(originalData);
      setIsSimulation(false);
    }
  };

  const handleSavePortfolio = () => {
    console.log('Saving portfolio:', portfolioData);
    // TODO: Add saving to backend with logging of changes

    setOriginalData(portfolioData);
    setIsSimulation(false);
  };

  if (!portfolioData) {
    return (
      <div className="dashboard">
        <p className="loading-message">Loading portfolio data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header 
        portfolioType={portfolioData.portfolio_type} 
        portfolioData={portfolioData}
        isSimulation={isSimulation}
        onReset={handleResetPortfolio}
        onSave={handleSavePortfolio}
        onPortfolioUpdate={handlePortfolioUpdate}
      />
      
      <div className="dashboard-content">
        <div className="left-column">
          <PortfolioShift metrics={portfolioData.metrics} />
          
          <ProjectedValue 
            currentData={portfolioData.projected_value.current} 
            targetData={portfolioData.projected_value.target} 
            isSimulation={isSimulation}
          />
          
          <HistoricalAnalysis 
            data={portfolioData.historical_scenarios}
          />
        </div>
        
        <div className="right-column">
          <AssetAllocation 
            data={portfolioData.asset_allocation} 
            isSimulation={isSimulation}
          />
          
          <TargetPortfolio 
            privateData={portfolioData.asset_allocation.private} 
            publicData={portfolioData.asset_allocation.public} 
            isSimulation={isSimulation}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;