
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        // Redirect based on user role
        if (user.role === 'doctor') {
          navigate('/dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      } else {
        console.log('Index page: User not authenticated, redirecting to login');
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
