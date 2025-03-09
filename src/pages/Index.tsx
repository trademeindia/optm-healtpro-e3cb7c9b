
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        // Redirect based on user role
        navigate(user.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
      } else {
        console.log('Index page: User not authenticated, redirecting to login');
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
