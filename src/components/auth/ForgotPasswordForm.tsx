
import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ForgotPasswordFormProps {
  forgotEmail: string;
  setForgotEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
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
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
      <p className="text-muted-foreground mb-8">Enter your email to receive a password reset link</p>
      
      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <Label htmlFor="forgotEmail">Email Address</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="forgotEmail"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="pl-10"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-2"
            onClick={onBackToLogin}
            disabled={isSubmitting}
          >
            Back to Login
          </Button>
          <Button
            type="submit"
            className="flex-1 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Link'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
