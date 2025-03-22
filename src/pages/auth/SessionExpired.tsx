
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SessionExpired: React.FC = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <h1 className="text-2xl font-bold mb-4">Session Expired</h1>
        <p className="text-muted-foreground mb-6">
          Your session has timed out due to inactivity. Please log in again to continue.
        </p>
        <Button onClick={handleReturn} className="w-full">
          Return to Login
        </Button>
      </div>
    </div>
  );
};

export default SessionExpired;
