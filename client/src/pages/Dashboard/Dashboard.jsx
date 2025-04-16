// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
// If you're using the updated components, change the imports
// Otherwise you'll need to replace these files in your project
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
        setOriginalData(data); // Keep a copy of the original data
        console.log('Portfolio data loaded from backend');
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };
  
    fetchData();
  }, []);

  // Function to handle portfolio updates from chat interactions
  const handlePortfolioUpdate = (update) => {
    // If not already in simulation mode, enter it and store original state
    if (!isSimulation) {
      setOriginalData({ ...portfolioData });
      setIsSimulation(true);
    }

    // Handle different types of updates
    if (update.type === "simulation" || update.type === "optimization") {
      const { allocations, metrics } = update;
      
      // Update portfolio data with new allocations and metrics
      setPortfolioData(prevData => {
        // Create deep copy of the data
        const newData = { ...prevData };
        
        // Update metrics
        newData.metrics = {
          return: { value: metrics.return * 100, change: metrics.return * 100 - prevData.metrics.return.value },
          yield: { value: metrics.yield * 100, change: metrics.yield * 100 - prevData.metrics.yield.value },
          volatility: { value: metrics.volatility * 100, change: metrics.volatility * 100 - prevData.metrics.volatility.value }
        };
        
        // Update allocations in the UI structure
        const mapping = {
          'venture_capital': 'Venture capital - early stage',
          'private_equity': 'Private equity - buyout',
          'real_estate_value': 'Real estate - value add',
          'real_estate_core': 'Real estate - core',
          'public_bonds': 'Public bonds',
          'public_equities': 'Public equities'
        };

        // Calculate private and public totals
        let privateTotal = 0;
        let publicTotal = 0;
        
        // Update each category
        newData.assetAllocation.private.categories = newData.assetAllocation.private.categories.map(category => {
          const key = Object.keys(mapping).find(k => mapping[k] === category.name);
          if (key && allocations[key] !== undefined) {
            const change = allocations[key] - category.value;
            privateTotal += allocations[key];
            return { ...category, value: allocations[key], change };
          }
          privateTotal += category.value;
          return category;
        });
        
        newData.assetAllocation.public.categories = newData.assetAllocation.public.categories.map(category => {
          const key = Object.keys(mapping).find(k => mapping[k] === category.name);
          if (key && allocations[key] !== undefined) {
            const change = allocations[key] - category.value;
            publicTotal += allocations[key];
            return { ...category, value: allocations[key], change };
          }
          publicTotal += category.value;
          return category;
        });
        
        // Update totals
        newData.assetAllocation.private.total = privateTotal;
        newData.assetAllocation.public.total = publicTotal;
        
        return newData;
      });
    } 
    else if (update.type === "scenario_analysis") {
      // For historical scenario analysis, we could highlight the impact
      // This might involve adding a 'currentScenario' property to the state
      setPortfolioData(prevData => {
        const newData = { ...prevData };
        newData.currentScenario = {
          name: update.scenario,
          impact: update.impact,
          impactByAsset: update.impactByAsset
        };
        return newData;
      });
    }
  };

  // Function to reset the portfolio to original state
  const handleResetPortfolio = () => {
    if (isSimulation && originalData) {
      setPortfolioData(originalData);
      setIsSimulation(false);
    }
  };

  // Function to save the current portfolio state
  const handleSavePortfolio = () => {
    // In a real application, this would send the updated portfolio to the backend
    console.log('Saving portfolio:', portfolioData);
    // Reset simulation state after saving
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
        portfolioType={portfolioData.portfolioType} 
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
            currentData={portfolioData.projectedValue.current} 
            targetData={portfolioData.projectedValue.target} 
            isSimulation={isSimulation}
          />
          
          <HistoricalAnalysis 
            data={portfolioData.historical_scenarios} 
            currentScenario={portfolioData.currentScenario}
          />
        </div>
        
        <div className="right-column">
          <AssetAllocation 
            data={portfolioData.assetAllocation} 
            isSimulation={isSimulation}
          />
          
          <TargetPortfolio 
            privateData={portfolioData.assetAllocation.private} 
            publicData={portfolioData.assetAllocation.public} 
            isSimulation={isSimulation}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;