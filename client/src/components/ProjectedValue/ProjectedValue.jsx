// src/components/ProjectedValue/ProjectedValue.jsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ProjectedValue.css';

const ProjectedValue = ({ currentData, targetData }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current || !currentData || !targetData) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const xScale = d3.scaleLinear()
      .domain([d3.min(currentData, d => d.year), d3.max(currentData, d => d.year)])
      .range([0, width]);
    
    // Y scale
    const maxValue = Math.max(
      d3.max(currentData, d => d.value),
      d3.max(targetData, d => d.value)
    );
    
    const yScale = d3.scaleLinear()
      .domain([0, maxValue * 1.1]) // Add 10% padding at the top
      .range([height, 0]);
    
    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d.toString()));
    
    // Y axis with dollar formatting
    svg.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => `$${d}M`));
    
    // Current portfolio line
    const currentLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(currentData)
      .attr('fill', 'none')
      .attr('stroke', '#8dd1e1')
      .attr('stroke-width', 2)
      .attr('d', currentLine);
    
    // Target portfolio line
    const targetLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(targetData)
      .attr('fill', 'none')
      .attr('stroke', '#235d72')
      .attr('stroke-width', 2)
      .attr('d', targetLine);
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 160}, 15)`);
    
    // Current portfolio legend
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
    
    // Target portfolio legend
    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 15)
      .attr('x2', 20)
      .attr('y2', 15)
      .attr('stroke', '#235d72')
      .attr('stroke-width', 2);
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 19)
      .text('Target portfolio')
      .attr('font-size', '10px');
    
  }, [currentData, targetData]);
  
  return (
    <div className="projected-value dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Projected value</h2>
      </div>
      
      <div className="projected-value-subtitle">
        Our estimate of total portfolio value over time
      </div>
      
      <div className="chart-container" ref={chartRef}></div>
    </div>
  );
};

export default ProjectedValue;