
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import { useLoginState } from '@/hooks/useLoginState';
import { toast } from 'sonner';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import SignupDialog from '@/components/auth/SignupDialog';
import MarketingPanel from '@/components/auth/MarketingPanel';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import DebugSection from '@/components/auth/DebugSection';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/pages/dashboard/components/ErrorBoundary';

const LoginPage: React.FC = () => {
  const loginState = useLoginState();
  
  // Set up additional state variables that don't exist in useLoginState
  const [userType, setUserType] = useState<'doctor' | 'patient' | 'receptionist'>('doctor');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showDebug, setShowDebug] = useState(false);
  
  // Helper functions that aren't in the useLoginState hook
  const handleForgotPassword = async (): Promise<void> => {
    console.log('Handling forgot password for:', forgotEmail);
    toast.success('Password reset email sent!');
    setShowForgotPassword(false);
    return Promise.resolve(); // Explicitly return a Promise to satisfy TypeScript
  };
  
  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log('Signing up with:', signupData);
    toast.success('Account created successfully!');
    setShowSignupDialog(false);
    return Promise.resolve(); // Explicitly return a Promise to satisfy TypeScript
  };
  
  const handleSocialLogin = (provider: string): void => {
    console.log(`Logging in with ${provider}`);
    toast.info(`Redirecting to ${provider} login...`);
  };
  
  const handleTabChange = (value: 'doctor' | 'patient' | 'receptionist'): void => {
    setUserType(value);
  };
  
  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDebugMode = (): void => {
    setShowDebug(!showDebug);
  };

  const toggleSignUpDialog = async (): Promise<void> => {
    setShowSignupDialog(!showSignupDialog);
    return Promise.resolve();
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-indigo-950">
        {/* Marketing Panel (left side) */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-[url('/public/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png')] bg-center bg-no-repeat bg-cover opacity-10"></div>
          <MarketingPanel userType={userType === 'receptionist' ? 'doctor' : userType} />
        </motion.div>
        
        {/* Login Form Area (right side) */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-xl border border-white/30 dark:border-white/5 bg-white/95 dark:bg-gray-800/90 backdrop-blur-md">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Medical Platform Access
                </CardTitle>
                <CardDescription className="text-center">
                  Sign in to continue to the healthcare portal
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* User Type Selector (tabs for patient, doctor, receptionist) */}
                <UserTypeSelector userType={userType} onTabChange={handleTabChange} />
                
                {showForgotPassword ? (
                  <ForgotPasswordForm 
                    forgotEmail={forgotEmail} 
                    setForgotEmail={setForgotEmail} 
                    onSubmit={handleForgotPassword}
                    onBackToLogin={() => setShowForgotPassword(false)}
                    isSubmitting={loginState.isLoading}
                  />
                ) : (
                  <>
                    {/* Social Login Options - Now only Google */}
                    <SocialLoginButtons 
                      onGoogleLogin={() => handleSocialLogin('google')}
                      isSubmitting={loginState.isLoading}
                    />
                    
                    {/* Login Form */}
                    <LoginForm
                      email={loginState.email}
                      setEmail={(email) => loginState.handleEmailChange({ target: { value: email } } as any)}
                      password={loginState.password}
                      setPassword={(password) => loginState.handlePasswordChange({ target: { value: password } } as any)}
                      userType={userType}
                      isSubmitting={loginState.isLoading}
                      onSubmit={loginState.handleSubmit}
                      onForgotPassword={() => setShowForgotPassword(true)}
                    />
                    
                    {/* Sign Up Option */}
                    <motion.div 
                      className="mt-6 text-center text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <p className="text-muted-foreground">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={toggleSignUpDialog}
                          className="text-primary hover:underline font-medium transition-colors"
                        >
                          Sign up
                        </button>
                      </p>
                    </motion.div>
                  </>
                )}
                
                {/* Debug toggle for development */}
                <div className="mt-4 text-center">
                  <button 
                    onClick={toggleDebugMode} 
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                  </button>
                </div>
                
                {showDebug && (
                  <DebugSection showDebug={showDebug} setShowDebug={setShowDebug} />
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Sign Up Dialog */}
          <SignupDialog
            showSignupDialog={showSignupDialog}
            setShowSignupDialog={setShowSignupDialog}
            signupData={signupData}
            handleSignupInputChange={handleSignupInputChange}
            handleSignup={handleSignup}
            isSubmitting={loginState.isLoading}
            userType={userType === 'receptionist' ? 'patient' : userType}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LoginPage;
