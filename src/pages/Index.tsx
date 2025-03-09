
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on user role
        navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse">Redirecting...</div>
    </div>
  );
};

export default Index;
