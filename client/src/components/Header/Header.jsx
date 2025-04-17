// src/components/Header/Header.jsx
import { useState } from 'react';
import ChatButton from '../ChatBot/ChatButton.jsx';
import './Header.css';

const Header = ({ portfolioType, portfolioData, isSimulation, onReset, onSave, onPortfolioUpdate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const portfolioOptions = [
    'Balanced Portfolio',
    'Growth Portfolio',
    'Income Portfolio',
    'Conservative Portfolio',
    'Aggressive Portfolio'
  ];

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">
          Model portfolio
          {isSimulation && <span className="simulation-badge">Simulation Mode</span>}
        </h1>
      </div>
      
      <div className="header-right">
        <div className="portfolio-dropdown">
          <button 
            className="dropdown-button"
            /* Turning off drop down button for now... */
            /* onClick={() => setIsDropdownOpen(!isDropdownOpen)} */
          >
            {portfolioType}
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-content">
              {portfolioOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="dropdown-item"
                  onClick={() => {
                    console.log(`Selected portfolio: ${option}`);
                    setIsDropdownOpen(false);
                    // TODO: add the update of the model portfolio
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="header-actions">
          <button 
            className="menu-button"
            /* Turning off menu button for now */
            /* onClick={() => setIsMenuOpen(!isMenuOpen)} */
          >
            ⋮
          </button>
          
          {isMenuOpen && (
            <div className="menu-content">
              <div className="menu-item">Edit</div>
              <div className="menu-item">Share</div>
              <div className="menu-item">Export</div>
              <div className="menu-item">Delete</div>
            </div>
          )}
          
          {/* Removing these buttons for clarity right now */}
          {/* <button 
            className={`reset-button ${isSimulation ? 'active' : ''}`} 
            onClick={onReset}
            disabled={!isSimulation}
          >
            Reset
          </button> */}
          {/* <button 
            className={`save-button ${isSimulation ? 'active' : ''}`}
            onClick={onSave}
            disabled={!isSimulation}
          >
            Save
          </button> */}

          <ChatButton 
            portfolioData={portfolioData} 
            onPortfolioUpdate={onPortfolioUpdate}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;