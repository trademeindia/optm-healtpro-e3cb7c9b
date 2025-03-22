
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/auth';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from "./components/ui/sonner";

// Import CSS in the right order
// Base styles first
import './styles/base.css';
// Then utilities
import './styles/utilities.css';
// Then components
import './styles/components.css';
// Then animations
import './styles/animations.css';
// Then main style that will inherit from the above
import './styles/main.css';
// Finally App-specific styles
import './App.css';

// Import responsive styles in order of specificity
import './styles/responsive/elements.css';
import './styles/responsive/layout.css';
import './styles/responsive/anatomy.css';
import './styles/responsive/anatomy-components.css';
import './styles/responsive/buttons.css';
import './styles/responsive/cards.css';
import './styles/responsive/tabs.css';
import './styles/responsive/hotspots.css';
import './styles/responsive/biomarker-cards.css';
import './styles/responsive/exercise-cards.css';
import './styles/responsive/metric-cards.css';

// Use createRoot API properly with proper error handling
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Fix the error handler to match the expected signature in ErrorBoundary
const handleError = (error: Error) => {
  console.error('Root level error caught:', error);
};

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary onError={handleError}>
        <Router>
          <AuthProvider>
            <App />
            <Toaster position="top-right" />
          </AuthProvider>
        </Router>
      </ErrorBoundary>
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
      </div>
    `;
  }
}
