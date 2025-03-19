
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log("Index page rendered with auth state:", { isAuthenticated, isLoading, user });
    
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        
        // Redirect based on role
        let dashboard;
        switch(user.role) {
          case 'doctor':
            dashboard = '/dashboard';
            break;
          case 'admin': // We're using admin role for receptionist temporarily
            dashboard = '/receptionist-dashboard';
            break;
          case 'patient':
          default:
            dashboard = '/patient-dashboard';
        }
        
        console.log(`Navigating to ${dashboard}`);
        navigate(dashboard);
      } else {
        console.log('Index page: User not authenticated, redirecting to login');
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
        <div className="animate-pulse text-foreground p-4 text-center">
          <h2 className="text-xl font-medium">Loading...</h2>
          <p className="mt-2 text-muted-foreground">Please wait while we prepare your experience</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
