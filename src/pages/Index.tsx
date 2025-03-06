
import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const Index = () => {
  // Using Navigate component instead of useNavigate hook
  // to avoid React Router context issues
  return <Navigate to="/dashboard" replace />;
};

export default Index;
