
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordFormProps {
  forgotEmail: string;
  setForgotEmail: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => Promise<void>;
  onBackToLogin: () => void;
  isSubmitting: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  forgotEmail,
  setForgotEmail,
  onSubmit,
  onBackToLogin,
  isSubmitting
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          placeholder="Enter your email address"
          disabled={isSubmitting}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Reset Password'}
        </Button>
        <Button 
          type="button" 
          variant="link" 
          onClick={onBackToLogin}
          className="text-sm"
        >
          Back to Login
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
