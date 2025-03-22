
import React, { useState } from 'react';
import { useLoginState } from '@/hooks/useLoginState';
import { UserRole } from '@/contexts/auth/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  // Use the login state hook that provides the correct methods and state
  const {
    email,
    password,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    handleDemoLogin
  } = useLoginState();

  // Add additional state for the login page UI
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [userType, setUserType] = useState<UserRole>(UserRole.PATIENT);
  const [showSignupDialog, setShowSignupDialog] = useState(false);

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement forgot password logic here
    setShowForgotPassword(false);
  };

  const handleSignup = () => {
    setShowSignupDialog(true);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // Implementation would depend on your auth context
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        <Card className="border shadow-lg">
          <CardContent className="p-6">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('google')}
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('apple')}
                >
                  Apple
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('github')}
                >
                  GitHub
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleSignup}
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </button>
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-center text-xs text-muted-foreground">Demo Accounts</p>
                <div className="flex justify-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDemoLogin('patient')}
                    className="text-xs"
                  >
                    Patient
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDemoLogin('doctor')}
                    className="text-xs"
                  >
                    Doctor
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDemoLogin('receptionist')}
                    className="text-xs"
                  >
                    Receptionist
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
