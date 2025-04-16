// src/components/AssetAllocation/AssetAllocation.jsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './AssetAllocation.css';

const AssetAllocation = ({ data }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current || !data) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Prepare data for donut chart
    const donutData = [
      ...data.private.categories.map(category => ({
        name: category.name,
        value: category.value,
        type: 'private'
      })),
      ...data.public.categories.map(category => ({
        name: category.name,
        value: category.value,
        type: 'public'
      }))
    ];
    
    // Chart dimensions
    const containerWidth = chartRef.current.clientWidth;
    const containerHeight = 250; // Fixed height for better proportions
    const width = Math.min(containerWidth, containerHeight);
    const height = width; // Keep it square
    const margin = 0;
    const radius = Math.min(width, height) / 2 - margin;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'donut-chart')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Color scale matching the design
    const colorScale = d3.scaleOrdinal()
      .domain(donutData.map(d => d.name))
      .range([
        // Private categories - darker greens to lighter teals
        '#1f4e42', '#286e5b', '#42a792', '#a8d4d1', 
        // Public categories - blues
        '#5a8fcd', '#adc8e8'
      ]);
    
    // Donut layout
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.02); // Add space between segments
    
    // Arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.67) // Create larger donut hole
      .outerRadius(radius)
      .cornerRadius(3); // Slightly rounded corners
    
    // Draw donut segments
    svg.selectAll('path')
      .data(pie(donutData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.name))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 1);
    
    // Create center white circle with border
    svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.65)
      .attr('fill', 'white')
      .attr('stroke', '#f0f0f0')
      .attr('stroke-width', 1);
    
    // Add center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .attr('class', 'donut-center-text-title')
      .text('Asset');
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 15)
      .attr('class', 'donut-center-text-title')
      .text('Allocation');
  }, [data]);
  
  return (
    <div className="asset-allocation dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Asset allocation</h2>
        <button className="edit-button">Edit</button>
      </div>
      
      <div className="chart-container" ref={chartRef}></div>
      
      <div className="allocation-summary">
        <h3 className="allocation-header">Opto private allocations</h3>
        <div className="allocation-item">
          <span className="allocation-name">Balanced Private Allocation</span>
          <span className="allocation-value">{data.private.total.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;