
import React from 'react';
import SocialButton from './SocialButton';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  onLogin: () => Promise<void>;
  disabled: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onLogin, disabled }) => {
  const handleLogin = async () => {
    try {
      await onLogin();
    } catch (error) {
      console.error('Google login error:', error);
      // Error handling is now done in onLogin function
    }
  };

  return (
    <SocialButton
      onClick={handleLogin}
      disabled={disabled}
      icon={<FcGoogle className="h-5 w-5" />}
      provider="Google"
      testId="google-login-button"
      className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    />
  );
};

export default GoogleLoginButton;
