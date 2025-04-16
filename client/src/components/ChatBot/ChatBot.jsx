// src/components/ChatBot/ChatBot.jsx
import { useState } from 'react';
import './ChatBot.css';

const ChatBot = ({ portfolioData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
    const url = 'http://localhost:8000/chat'
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
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
      const reply = data.assistant_message?.content || 'No response';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFlatAllocations = (data) => {
    const categories = [...data.private.categories, ...data.public.categories];
    return categories.reduce((acc, item) => {
      acc[normalizeName(item.name)] = item.value;
      return acc;
    }, {});
  };

  const normalizeName = (name) => name.toLowerCase().replace(/[^a-z]/g, '_');

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <span>{msg.content}</span>
          </div>
        ))}
        {isLoading && <div className="chat-message assistant">Thinking...</div>}
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask something about the portfolio..." 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
