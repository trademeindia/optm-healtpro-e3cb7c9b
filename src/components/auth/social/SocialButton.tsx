
import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialButtonProps {
  onClick: () => Promise<void>;
  disabled: boolean;
  icon: React.ReactNode;
  provider: string;
  testId?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  onClick,
  disabled,
  icon,
  provider,
  testId
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center justify-center gap-2 h-11"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {icon}
      <span>Continue with {provider}</span>
    </Button>
  );
};

export default SocialButton;
