
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './App.css'
import './styles/main.css'

// Add more robust logging to help diagnose startup issues
console.log('Main.tsx is executing - starting React app initialization');

// Catch any rendering errors at the root level
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Fatal error: Root element not found in document!');
} else {
  try {
    console.log('Creating React root and mounting application');
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React app successfully mounted');
  } catch (error) {
    console.error('Fatal error during React initialization:', error);
  }
}
