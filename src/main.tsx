
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Import all CSS in the correct order - this is critical for proper styling
import './styles/base.css'
import './styles/utilities.css'
import './styles/animations.css'
import './styles/components.css'
import './styles/main.css'
import './styles/cards/base.css'
import './styles/cards/variants.css'
import './styles/cards/utilities.css'
import './styles/cards/specialized.css'
import './styles/responsive/elements.css'
import './styles/responsive/anatomy.css'
import './styles/responsive/anatomy-components.css'
import './styles/responsive/tabs.css'
import './styles/responsive/cards.css'
import './styles/responsive/layout.css'
import './styles/responsive/buttons.css'
import './styles/responsive/hotspots.css'
import './App.css'

// Use createRoot API properly with proper error handling
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

try {
  console.log('Starting application render');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Failed to render the application:', error);
  // Display a fallback error UI
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Application Error</h2>
        <p>We're sorry, but something went wrong. Please refresh the page or try again later.</p>
        <pre style="background: #f5f5f5; padding: 10px; text-align: left; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
      </div>
    `;
  }
}
