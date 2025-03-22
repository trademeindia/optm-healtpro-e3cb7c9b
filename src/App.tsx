
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from './contexts/auth';
import { Routes, Route } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import { Toaster } from "./components/ui/sonner";

// Handle loading state
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  const { isLoading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Set app as ready after a short delay to ensure all resources are loaded
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !appReady) {
    return <Loading />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppRoutes />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};

export default App;
