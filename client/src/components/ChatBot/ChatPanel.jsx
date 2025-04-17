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
        content: "Hi there! I'm Opto, your portfolio assistant. Ready to fine-tune your allocations? Just ask."
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
            allocations: getFlatAllocations(portfolioData.asset_allocation),

            metrics: {
              return: portfolioData.metrics.return.value,
              yield: portfolioData.metrics.yield.value,
              volatility: portfolioData.metrics.volatility.value
            }
          }
        }),
      });
      
      const data = await response.json();
      console.log(data)
      
      let assistantMessage;
      
      if (data.type === 'function_result') {
        handleFunctionResult(data);
        
        assistantMessage = {
          role: 'assistant',
          content: data.assistant_message,
        };
      } else {
        assistantMessage = {
          role: 'assistant',
          content: data.assistant_message
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
    setInSimulation(true);
    
    if (data.function_name === "simulate_allocation_change") {
      onPortfolioUpdate && onPortfolioUpdate({
        type: "simulation",
        allocations: data.simulated_allocations,
        metrics: data.simulated_metrics
      });
    } 
  };
  
  const handleResetSimulation = () => {
    if (inSimulation && onPortfolioUpdate) {
      onPortfolioUpdate({ type: 'reset' });
      setInSimulation(false);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'ve reset the portfolio to its original state.'
      }]);

      // TODO: Add communication with the backend
    }
  };
  
  const handleSaveSimulation = () => {
    if (inSimulation && onPortfolioUpdate) {
      onPortfolioUpdate({ type: 'save' });
      setInSimulation(false);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'ve saved the changes to the portfolio.'
      }]);

      // TODO: Add communication with the backend
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