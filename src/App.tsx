
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from './contexts/auth';
import AppRoutes from './routes/Routes';
import { Toaster } from "sonner";
import ErrorBoundary from './components/ErrorBoundary';

// Handle loading state
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="p-6 text-center border border-gray-200 rounded-lg shadow-sm max-w-md bg-white dark:bg-gray-800">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <h2 className="text-xl font-medium">Loading Application</h2>
      <p className="mt-2 text-muted-foreground">Please wait while we set up your experience</p>
    </div>
  </div>
);

const App = () => {
  const { isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log("App rendered, auth loading:", authLoading);
    
    // Only show initial loading state briefly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [authLoading]);

  const handleAppError = (error: Error) => {
    console.error("Root level error caught:", error);
    setHasError(true);
    
    // Auto-reload after serious errors
    setTimeout(() => {
      if (hasError) {
        window.location.reload();
      }
    }, 10000);
  };

  if (loading && authLoading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary 
      onError={handleAppError}
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="p-6 text-center border border-red-200 rounded-lg shadow-sm max-w-md bg-white dark:bg-gray-800">
            <div className="text-red-500 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-xl font-medium">Application Error</h2>
            <p className="mt-2 text-muted-foreground">Sorry, the application encountered a critical error.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      }
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <div className="app-container full-height-layout">
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
