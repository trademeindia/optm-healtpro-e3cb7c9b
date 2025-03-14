
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './App.css'
import './styles/main.css'

// Add a console log to check if main.tsx is executing properly
console.log('Main.tsx is executing - mounting React app');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
