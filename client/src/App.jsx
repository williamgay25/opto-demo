import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Loading...')
  const [error, setError] = useState(null)
  const [inputText, setInputText] = useState('')
  const [responseText, setResponseText] = useState('')

  // Local Development
  // const BACKEND_URL = 'http://0.0.0.0:8000'
  const BACKEND_URL = 'https://opto-demo-production.up.railway.app'

  useEffect(() => {
    fetch(`${BACKEND_URL}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        setMessage(`Connected to backend! Response: ${JSON.stringify(data)}`)
      })
      .catch(error => {
        setError(`Failed to connect to backend: ${error.message}`)
        setMessage('Connection failed')
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setResponseText('Sending to backend...')
      
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      setResponseText(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponseText(`Error: ${error.message}`)
    }
  }

  return (
    <div className="container">
      <h1>Opto AI Assistant - Connection Test</h1>
      
      <div className="status-card">
        <h2>Backend Connection Status:</h2>
        <p className={error ? 'error' : 'success'}>{message}</p>
        {error && <p className="error-details">{error}</p>}
      </div>
      
      <div className="test-form">
        <h2>Test Chat Endpoint:</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to send to the backend"
          />
          <button type="submit">Send</button>
        </form>
        
        <div className="response">
          <h3>Response:</h3>
          <pre>{responseText}</pre>
        </div>
      </div>
    </div>
  )
}

export default App