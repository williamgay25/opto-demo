// ChatPanel.jsx - The slide-in chat panel
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatPanel.css';

const url = import.meta.env.VITE_BACKEND_URL + '/chat';

const ChatPanel = ({ isOpen, onClose, portfolioData, onPortfolioUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inSimulation, setInSimulation] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hi there! I'm Opto, your portfolio assistant. Ready to explore private alternatives or fine-tune your allocations? Just ask."
      }]);
    }
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    const resizeTextarea = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      textarea.style.height = 'auto';
      
      const maxHeight = 120;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = newHeight === maxHeight ? 'auto' : 'hidden';
    };
    
    resizeTextarea();
  }, [input]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          portfolio_data: {
            allocations: getFlatAllocations(portfolioData.assetAllocation),
            metrics: {
              return: portfolioData.metrics.return.value / 100, // Convert to decimal for backend
              yield: portfolioData.metrics.yield.value / 100,
              volatility: portfolioData.metrics.volatility.value / 100
            }
          }
        }),
      });
      
      const data = await response.json();
      
      let assistantMessage;
      
      if (data.type === 'function_result') {
        // Handle function results (simulation, optimization, etc.)
        handleFunctionResult(data);
        
        // Add a message about what was done
        assistantMessage = {
          role: 'assistant',
          content: generateFunctionResultMessage(data),
          functionResult: data  // Store the full result for potential UI updates
        };
      } else {
        assistantMessage = {
          role: 'assistant',
          content: data.assistant_message?.content || 'I processed your request.'
        };
      }
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const getFlatAllocations = (data) => {
    const mapping = {
      'Venture capital - early stage': 'venture_capital',
      'Private equity - buyout': 'private_equity',
      'Real estate - value add': 'real_estate_value',
      'Real estate - core': 'real_estate_core',
      'Public bonds': 'public_bonds',
      'Public equities': 'public_equities'
    };
    
    const result = {};
    data.private.categories.forEach(item => {
      const key = mapping[item.name];
      if (key) result[key] = item.value;
    });
    
    data.public.categories.forEach(item => {
      const key = mapping[item.name];
      if (key) result[key] = item.value;
    });
    
    return result;
  };
  
  const handleFunctionResult = (data) => {
    // Set simulation mode flag
    setInSimulation(true);
    
    // Pass the result up to parent component
    if (data.function_name === "simulate_allocation_change") {
      onPortfolioUpdate && onPortfolioUpdate({
        type: "simulation",
        allocations: data.simulated_allocations,
        metrics: data.simulated_metrics
      });
    } 
    else if (data.function_name === "analyze_historical_scenario") {
      onPortfolioUpdate && onPortfolioUpdate({
        type: "scenario_analysis",
        scenario: data.scenario,
        impact: data.total_portfolio_impact,
        impactByAsset: data.impact_by_asset
      });
    }
    else if (data.function_name === "optimize_allocation") {
      onPortfolioUpdate && onPortfolioUpdate({
        type: "optimization",
        allocations: data.optimized_allocations,
        metrics: data.optimized_metrics,
        shifted: data.shifted
      });
    }
  };
  
  const generateFunctionResultMessage = (data) => {
    // Create a user-friendly message based on the function result
    switch (data.function_name) {
      case "simulate_allocation_change":
        const assetClass = data.simulated_allocations 
          ? Object.keys(data.simulated_allocations).find(
              key => data.simulated_allocations[key] !== data.original_allocations[key]
            )
          : null;
          
        const oldValue = assetClass ? data.original_allocations[assetClass] : null;
        const newValue = assetClass ? data.simulated_allocations[assetClass] : null;
        
        return `I've simulated changing your ${formatAssetName(assetClass)} allocation from ${oldValue}% to ${newValue}%. This would change your expected return from ${(data.original_metrics.return * 100).toFixed(1)}% to ${(data.simulated_metrics.return * 100).toFixed(1)}%, and volatility from ${(data.original_metrics.volatility * 100).toFixed(1)}% to ${(data.simulated_metrics.volatility * 100).toFixed(1)}%.`;
      
      case "analyze_historical_scenario":
        return `I've analyzed how your portfolio would perform in a ${data.scenario.replace(/_/g, ' ')} scenario. The total impact would be ${data.total_portfolio_impact > 0 ? '+' : ''}${data.total_portfolio_impact}%. The dashboard has been updated to reflect this analysis.`;
      
      case "optimize_allocation":
        return `I've optimized your portfolio by shifting ${data.shifted.amount}% from ${formatAssetName(data.shifted.from)} to ${formatAssetName(data.shifted.to)}. This change increases your expected return from ${(data.original_metrics.return * 100).toFixed(1)}% to ${(data.optimized_metrics.return * 100).toFixed(1)}% while managing volatility.`;
      
      default:
        return "I've processed your request and updated the portfolio visualization.";
    }
  };
  
  const formatAssetName = (assetKey) => {
    if (!assetKey) return '';
    
    const nameMap = {
      'venture_capital': 'Venture Capital',
      'private_equity': 'Private Equity',
      'real_estate_value': 'Real Estate (Value Add)',
      'real_estate_core': 'Real Estate (Core)',
      'public_bonds': 'Public Bonds',
      'public_equities': 'Public Equities'
    };
    
    return nameMap[assetKey] || assetKey;
  };
  
  const handleResetSimulation = () => {
    if (inSimulation && onPortfolioUpdate) {
      onPortfolioUpdate({ type: 'reset' });
      setInSimulation(false);
      
      // Add a message about the reset
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'ve reset the portfolio to its original state.'
      }]);
    }
  };
  
  const handleSaveSimulation = () => {
    if (inSimulation && onPortfolioUpdate) {
      onPortfolioUpdate({ type: 'save' });
      setInSimulation(false);
      
      // Add a message about the save
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'ve saved the changes to the portfolio.'
      }]);
    }
  };
  
  return (
    <div className={`chat-panel ${isOpen ? 'open' : ''} ${inSimulation ? 'in-simulation' : ''}`}>
      <div className="chat-header">
        <h3>AI Portfolio Assistant {inSimulation && <span className="simulation-indicator">Simulation Active</span>}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your portfolio..."
          rows={1}
        />
        <button 
          className="send-button" 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </div>
      
      {inSimulation && (
        <div className="simulation-controls">
          <button 
            className="simulation-button reset" 
            onClick={handleResetSimulation}
          >
            Reset Changes
          </button>
          <button 
            className="simulation-button save" 
            onClick={handleSaveSimulation}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;