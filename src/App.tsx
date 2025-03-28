
import React, { useState, useEffect, ErrorInfo } from 'react';
import { useAuth } from './contexts/auth';
import AppRoutes from './routes/Routes';
import './styles/responsive/hotspots.css';
import './styles/responsive/dialog.css';
import './styles/responsive/anatomy-components.css';
import ErrorBoundary from './components/ErrorBoundary';

// Handle loading state
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const { user, authError } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appError, setAppError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    console.log('App component mounted');
    
    // Set up global error handler
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Unhandled global error in App:', event.error);
      setAppError(event.error);
      event.preventDefault();
    };
    
    window.addEventListener('error', handleGlobalError);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleGlobalError);
      console.log('App component unmounted');
    };
  }, []);

  // Show auth errors at the app level
  useEffect(() => {
    if (authError) {
      console.error('Auth error in App:', authError);
      setAppError(authError);
    }
  }, [authError]);
  
  const handleAppError = (error: Error, errorInfo: ErrorInfo) => {
    console.error("Error caught by App ErrorBoundary:", error, errorInfo);
    setAppError(error);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary onError={handleAppError}>
      <div className="app-container full-height-layout">
        <AppRoutes />
      </div>
    </ErrorBoundary>
  );
}

export default App;
