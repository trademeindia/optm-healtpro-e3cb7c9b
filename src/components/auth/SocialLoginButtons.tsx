
import React from 'react';
import { GoogleLoginButton, AppleLoginButton, GithubLoginButton } from './social';
import { Separator } from '@/components/ui/separator';

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
      <div className="p-0.5 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-lg mb-1">
        <GoogleLoginButton 
          onLogin={onGoogleLogin}
          disabled={isSubmitting}
        />
      </div>
      
      <AppleLoginButton 
        onLogin={() => onSocialLogin('apple')}
        disabled={isSubmitting}
      />
      
      <GithubLoginButton 
        onLogin={() => onSocialLogin('github')}
        disabled={isSubmitting}
      />
      
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
