
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { MarketingPanel } from '@/components/auth/MarketingPanel';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <MarketingPanel userType="doctor" />
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
