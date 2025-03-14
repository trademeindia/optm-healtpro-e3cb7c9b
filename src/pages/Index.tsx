
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log("Index page rendered with auth state:", { isAuthenticated, isLoading, user });
    
    // Avoid infinite redirects by checking if we're still loading
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('Index page: User authenticated, role is', user.role);
        const dashboard = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
        console.log(`Navigating to ${dashboard}`);
        navigate(dashboard);
      } else {
        console.log('Index page: User not authenticated, redirecting to login');
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show a better loading indicator while isLoading is true
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="text-foreground p-4 text-center">
            <h2 className="text-xl font-medium">Loading Application...</h2>
            <p className="mt-2 text-muted-foreground">Please wait while we prepare your experience</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
