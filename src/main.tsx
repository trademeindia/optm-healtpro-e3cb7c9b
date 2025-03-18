
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<RootErrorFallback />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
