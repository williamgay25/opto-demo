// ChatPanel.jsx - The slide-in chat panel
import { useState, useEffect, useRef } from 'react';
import './ChatPanel.css';

const url = import.meta.env.VITE_BACKEND_URL + '/chat';

const ChatPanel = ({ isOpen, onClose, portfolioData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hello! I'm your AI portfolio assistant. How can I help you optimize your investments today?"
      }]);
    }
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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
              return: portfolioData.metrics.return.value,
              yield: portfolioData.metrics.yield.value,
              volatility: portfolioData.metrics.volatility.value
            }
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.type === 'function_result') {
        // Handle function results (simulation, optimization, etc.)
        handleFunctionResult(data);
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: data.assistant_message?.content || 'I processed your request.'
      };
      
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
    
    // Process private categories
    data.private.categories.forEach(item => {
      const key = mapping[item.name];
      if (key) result[key] = item.value;
    });
    
    // Process public categories
    data.public.categories.forEach(item => {
      const key = mapping[item.name];
      if (key) result[key] = item.value;
    });
    
    return result;
  };
  
  const handleFunctionResult = (data) => {
    // This would be expanded to handle different function types
    // and update the portfolio visualizations accordingly
    console.log('Function result:', data);
    
    // Here you would trigger state updates to reflect portfolio changes
  };
  
  return (
    <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <h3>AI Portfolio Assistant</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
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
      
      <div className="simulation-controls">
        {/* This would hold Reset/Save buttons when in simulation mode */}
      </div>
    </div>
  );
};

export default ChatPanel;