
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Import all CSS in the correct order
import './styles/base.css'
import './styles/main.css'
import './App.css'
import './styles/components.css'
import './styles/utilities.css'
import './styles/animations.css'
import './styles/responsive/hotspots.css'
import './styles/responsive/anatomy.css'
import './styles/responsive/anatomy-components.css'
import './styles/responsive/buttons.css'
import './styles/responsive/card-base.css'
import './styles/responsive/cards.css'
import './styles/responsive/elements.css'
import './styles/responsive/layout.css'
import './styles/responsive/tabs.css'
import './styles/responsive/biomarker-cards.css'
import './styles/responsive/exercise-cards.css'
import './styles/responsive/metric-cards.css'

// Use createRoot API properly
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
