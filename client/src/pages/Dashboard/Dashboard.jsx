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
      console.log(update.data);
      const updated_data = JSON.parse(JSON.stringify(portfolioData));
      console.log(portfolioData);
      
      const simulated_allocations = update.data.simulated_allocations;
      const simulated_metrics = update.data.simulated_metrics;
      
      updated_data.asset_allocation = simulated_allocations;
      updated_data.metrics = simulated_metrics;
      
      console.log(updated_data);
      setPortfolioData(updated_data);
    }

    if (update.type === "reset") {
      // TODO: Add communication with the backend
      console.log("Resetting portfolio data")
    }

    if (update.type === "save") {
      // TODO: Add communication with the backend
      console.log("Saving portfolio data")
    }

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