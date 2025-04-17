// ChatButton.jsx - A button to toggle the chat panel
import { useState } from 'react';
import ChatPanel from './ChatPanel';
import './ChatButton.css';

const ChatButton = ({ portfolioData, onPortfolioUpdate }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <>
      <button 
        className="chat-button" 
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Open AI Assistant"
      >
        <span className="chat-icon">💬</span>
        <span className="chat-label">AI Assistant</span>
      </button>
      
      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        portfolioData={portfolioData}
        onPortfolioUpdate={onPortfolioUpdate}
      />
    </>
  );
};

export default ChatButton;