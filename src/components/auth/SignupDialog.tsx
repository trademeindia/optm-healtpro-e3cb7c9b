
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SignupDialogProps {
  showSignupDialog: boolean;
  setShowSignupDialog: React.Dispatch<React.SetStateAction<boolean>>;
  signupData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  handleSignupInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignup: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  userType: 'doctor' | 'patient';
}

const SignupDialog: React.FC<SignupDialogProps> = ({
  showSignupDialog,
  setShowSignupDialog,
  signupData,
  handleSignupInputChange,
  handleSignup,
  isSubmitting,
  userType,
}) => {
  return (
    <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={signupData.name}
              onChange={handleSignupInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={signupData.email}
              onChange={handleSignupInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={signupData.password}
              onChange={handleSignupInputChange}
              placeholder="Create a password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={signupData.confirmPassword}
              onChange={handleSignupInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSignupDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
