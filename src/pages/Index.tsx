
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index page rendered, redirecting to login");
    navigate('/login');
  }, [navigate]);

  // Simple loading state while redirect happens
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className="text-foreground p-6 text-center border border-gray-200 rounded-lg shadow-sm max-w-md bg-white/50 dark:bg-gray-800/50">
        <div className="w-12 h-12 mb-4 mx-auto rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
        <h2 className="text-xl font-medium">Redirecting...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we redirect you to the login page</p>
      </div>
    </div>
  );
};

export default Index;
