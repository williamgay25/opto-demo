// src/components/HistoricalAnalysis/HistoricalAnalysis.jsx
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './HistoricalAnalysis.css';

const HistoricalAnalysis = ({ data }) => {
  const chartRef = useRef(null);
  const [activePage, setActivePage] = useState(1);
  const totalPages = 3;
  
  useEffect(() => {
    if (!chartRef.current || !data.inflationData) return;
    
    d3.select(chartRef.current).selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xScale = d3.scaleLinear()
      .domain([d3.min(data.inflationData, d => d.year), d3.max(data.inflationData, d => d.year)])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([-25, 100])
      .range([height, 0]);
    
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d => d.toString())
        .ticks(6));
    
    svg.append('g')
      .call(d3.axisLeft(yScale)
        .tickFormat(d => `${d}%`)
        .ticks(5));
    
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(data.inflationData)
      .attr('fill', 'none')
      .attr('stroke', '#8dd1e1')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    const targetData = data.inflationData.map(d => ({
      year: d.year,
      value: d.value + 5
    }));
    
    svg.append('path')
      .datum(targetData)
      .attr('fill', 'none')
      .attr('stroke', '#205e6e')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 160}, ${height - 50})`);
    
    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 20)
      .attr('y2', 0)
      .attr('stroke', '#8dd1e1')
      .attr('stroke-width', 2);
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 4)
      .text('Current portfolio')
      .attr('font-size', '10px');
    
    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 15)
      .attr('x2', 20)
      .attr('y2', 15)
      .attr('stroke', '#205e6e')
      .attr('stroke-width', 2);
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 19)
      .text('Target portfolio')
      .attr('font-size', '10px');
    
  }, [data.inflationData]);
  
  const renderPerformancePeriods = () => {
    const periods = [
      { label: 'All time', period: data.all_time.period, value: data.all_time.value },
      { label: 'Financial crisis', period: data.financial_crisis.period, value: data.financial_crisis.value },
      { label: 'European debt crisis', period: data.european_debt_crisis.period, value: data.european_debt_crisis.value },
      { label: 'Inflation', period: data.financial_crisis.period, value: data.financial_crisis.value },
    ];
    
    return (
      <div className="performance-periods">
        {periods.map((period, index) => (
          <div key={index} className="period-card">
            <div className="period-label">
              <span>{period.label}</span>
              <span className="info-icon">ℹ️</span>
            </div>
            <div className="period-timeframe">{period.period}</div>
            <div className="period-value positive">↑ {period.value}%</div>
          </div>
        ))}
      </div>
    );
  };
  
  const handlePrevPage = () => {
    setActivePage(prev => (prev > 1 ? prev - 1 : prev));
  };
  
  const handleNextPage = () => {
    setActivePage(prev => (prev < totalPages ? prev + 1 : prev));
  };
  
  return (
    <div className="historical-analysis dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Historical portfolio analysis</h2>
        
        <div className="pagination-controls">
          <button 
            className="pagination-button"
            onClick={handlePrevPage}
            disabled={activePage === 1}
          >
            ←
          </button>
          
          <span className="pagination-info">
            {activePage} / {totalPages}
          </span>
          
          <button 
            className="pagination-button"
            onClick={handleNextPage}
            disabled={activePage === totalPages}
          >
            →
          </button>
        </div>
      </div>
      
      {renderPerformancePeriods()}
      
      <div className="inflation-analysis">
        <h3 className="inflation-title">Inflation and rising rates (Jan 2007 - Oct 2024)</h3>
        
        <div className="chart-container" ref={chartRef}></div>
      </div>
    </div>
  );
};

export default HistoricalAnalysis;