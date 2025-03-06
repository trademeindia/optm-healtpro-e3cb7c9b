
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to dashboard to ensure the user sees the main content
    navigate('/dashboard');
  }, [navigate]);

  return <Dashboard />;
};

export default Index;
