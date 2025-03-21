import React, { useState, useEffect } from 'react';
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from './contexts/auth';
import { Routes, Route } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import OpenSimPage from './pages/OpenSimPage';

// Handle loading state
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
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
        <Routes>
          <Route path="/" element={<AppRoutes />} />
          <Route path="/opensim" element={<OpenSimPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
