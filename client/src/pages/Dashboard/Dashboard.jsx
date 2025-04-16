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
  // State for all dashboard data
  const [portfolioData, setPortfolioData] = useState({
    portfolioType: 'Balanced Portfolio',
    metrics: {
      return: { value: 13.7, change: 2 },
      yield: { value: 0.4, change: 0.4 },
      volatility: { value: 10.8, change: 0.2 }
    },
    assetAllocation: {
      private: {
        total: 10.0,
        categories: [
          { name: 'Venture capital - early stage', value: 2.5, change: 2.5 },
          { name: 'Private equity - buyout', value: 2.5, change: 2.5 },
          { name: 'Real estate - value add', value: 2.5, change: 2.5 },
          { name: 'Real estate - core', value: 2.5, change: 2.5 }
        ]
      },
      public: {
        total: 90.0,
        categories: [
          { name: 'Public bonds', value: 54.0, change: 6.0 },
          { name: 'Public equities', value: 36.0, change: 4.0 }
        ]
      }
    },
    projectedValue: {
      current: [
        { year: 2024, value: 5 },
        { year: 2026, value: 8 },
        { year: 2028, value: 12 },
        { year: 2030, value: 20 },
        { year: 2032, value: 30 },
        { year: 2034, value: 38 },
        { year: 2036, value: 45 },
        { year: 2038, value: 50 }
      ],
      target: [
        { year: 2024, value: 5 },
        { year: 2026, value: 10 },
        { year: 2028, value: 15 },
        { year: 2030, value: 25 },
        { year: 2032, value: 35 },
        { year: 2034, value: 45 },
        { year: 2036, value: 52 },
        { year: 2038, value: 60 }
      ],
    },
    historicalAnalysis: {
      allTime: { period: '2007-2024', value: 1 },
      financialCrisis: { period: '2007-2009', value: 2 },
      europeanDebtCrisis: { period: '2010-2012', value: 2 },
      inflationData: [
        { year: 2007, value: 0 },
        { year: 2008, value: -10 },
        { year: 2009, value: -15 },
        { year: 2010, value: 0 },
        { year: 2011, value: 10 },
        { year: 2012, value: 15 },
        { year: 2013, value: 20 },
        { year: 2014, value: 25 },
        { year: 2015, value: 30 },
        { year: 2016, value: 35 },
        { year: 2017, value: 40 },
        { year: 2018, value: 45 },
        { year: 2019, value: 60 },
        { year: 2020, value: 75 },
        { year: 2021, value: 65 }
      ]
    }
  });

  // Simulate fetching data from backend
  useEffect(() => {
    // This would be replaced with actual API calls
    const fetchData = async () => {
      try {
        // Mock API response
        // const response = await fetch('/api/portfolio-data');
        // const data = await response.json();
        // setPortfolioData(data);
        
        // For now, we're using the mock data initialized in state
        console.log('Mock data loaded successfully');
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <Header portfolioType={portfolioData.portfolioType} />
      
      <div className="dashboard-content">
        <div className="left-column">
          <PortfolioShift metrics={portfolioData.metrics} />
          
          <ProjectedValue 
            currentData={portfolioData.projectedValue.current} 
            targetData={portfolioData.projectedValue.target} 
          />
          
          <HistoricalAnalysis data={portfolioData.historicalAnalysis} />
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