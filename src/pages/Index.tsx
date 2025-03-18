
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log("Index page rendered with auth state:", { isAuthenticated, isLoading, user });
    
    // Give a bit more time for authentication to complete
    const timeoutId = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated && user) {
          console.log('Index page: User authenticated, role is', user.role);
          // For simplicity, direct all users to dashboard for now to ensure they see content
          navigate('/dashboard');
        } else {
          console.log('Index page: User not authenticated, redirecting to login');
          navigate('/login');
        }
      }
    }, 500); // Short timeout to ensure auth has time to complete
    
    return () => clearTimeout(timeoutId);
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

  // Render a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className="text-foreground p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-medium">Redirecting...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we direct you to the right page</p>
      </div>
    </div>
  );
};

export default Index;
