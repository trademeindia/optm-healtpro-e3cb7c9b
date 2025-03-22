
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import MarketingPanel from '@/components/auth/MarketingPanel';
import { useLoginState } from '@/hooks/useLoginState';

const LoginPage: React.FC = () => {
  const loginState = useLoginState();

  // Function to handle forgot password
  const handleForgotPassword = () => {
    // This would open a dialog or navigate to a forgot password page
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <MarketingPanel userType="doctor" />
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <LoginForm 
            email={loginState.email}
            setEmail={(email) => loginState.handleEmailChange({ target: { value: email } } as any)}
            password={loginState.password}
            setPassword={(password) => loginState.handlePasswordChange({ target: { value: password } } as any)}
            userType="doctor"
            isSubmitting={loginState.isLoading}
            onSubmit={loginState.handleSubmit}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
