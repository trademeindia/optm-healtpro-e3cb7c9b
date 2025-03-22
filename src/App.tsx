
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from './contexts/auth';
import AppRoutes from './routes/Routes';
import { Toaster } from "./components/ui/sonner";

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

  useEffect(() => {
    console.log("App rendered, auth loading:", authLoading);
    
    // Only show initial loading state briefly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [authLoading]);

  if (loading && authLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className="app-container full-height-layout">
        <AppRoutes />
        <Toaster position="top-right" />
      </div>
    </ThemeProvider>
  );
};

export default App;
