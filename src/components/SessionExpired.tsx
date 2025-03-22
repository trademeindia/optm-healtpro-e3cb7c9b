
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SessionExpired: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Session Expired</CardTitle>
          <CardDescription>
            Your session has expired due to inactivity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            For your security, we automatically sign you out when your account has been inactive for an extended period.
          </p>
          <Button onClick={handleLoginClick} className="w-full">
            Log in again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionExpired;
