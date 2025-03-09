
import React from 'react';
import { Button } from '@/components/ui/button';
import { Apple, Github } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

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
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 h-11"
        onClick={() => onGoogleLogin()}
        disabled={isSubmitting}
        data-testid="google-login-button"
      >
        <FcGoogle className="h-5 w-5" />
        <span>Continue with Google</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 h-11"
        onClick={() => onSocialLogin('apple')}
        disabled={isSubmitting}
      >
        <Apple className="h-5 w-5" />
        <span>Continue with Apple</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 h-11"
        onClick={() => onSocialLogin('github')}
        disabled={isSubmitting}
      >
        <Github className="h-5 w-5" />
        <span>Continue with GitHub</span>
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
