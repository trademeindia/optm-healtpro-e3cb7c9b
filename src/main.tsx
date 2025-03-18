
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './App.css'
import './styles/main.css'
import ErrorBoundary from './components/error-boundary/ErrorBoundary'

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Root error boundary fallback
const RootErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
    <h2 className="text-xl font-semibold mb-2">Application Error</h2>
    <p className="mb-6">The application encountered a critical error.</p>
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
      onClick={() => window.location.reload()}
    >
      Reload Application
    </button>
  </div>
);

// Render with safer initialization
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary fallback={<RootErrorFallback />}>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Failed to initialize application:', error);
  document.body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:20px;text-align:center;">
      <h2 style="margin-bottom:8px;font-size:1.5rem;font-weight:600;">Application Failed to Load</h2>
      <p style="margin-bottom:24px;">There was a critical error initializing the application.</p>
      <button 
        style="padding:8px 16px;background-color:#3b82f6;color:white;border-radius:6px;border:none;cursor:pointer;" 
        onclick="window.location.reload()">
        Retry Loading
      </button>
    </div>
  `;
}
