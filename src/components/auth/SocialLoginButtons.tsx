
import React from 'react';
import { GoogleLoginButton, AppleLoginButton, GithubLoginButton } from './social';

interface SocialLoginButtonsProps {
  onGoogleLogin: () => Promise<void>;
  onSocialLogin: (provider: 'google' | 'apple' | 'github') => Promise<void>;
  isSubmitting: boolean;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleLogin,
  onSocialLogin,
  isSubmitting
}) => {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <GoogleLoginButton 
        onLogin={onGoogleLogin}
        disabled={isSubmitting}
      />
      
      <AppleLoginButton 
        onLogin={() => onSocialLogin('apple')}
        disabled={isSubmitting}
      />
      
      <GithubLoginButton 
        onLogin={() => onSocialLogin('github')}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default SocialLoginButtons;
