
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import { useLoginState } from '@/hooks/useLoginState';
import { toast } from 'sonner';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { SignupDialog } from '@/components/auth/SignupDialog';
import { MarketingPanel } from '@/components/auth/MarketingPanel';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { DebugSection } from '@/components/auth/DebugSection';

const LoginPage: React.FC = () => {
  const {
    email, setEmail,
    password, setPassword,
    isSubmitting,
    showForgotPassword, setShowForgotPassword,
    forgotEmail, setForgotEmail,
    userType, setUserType,
    showSignupDialog, setShowSignupDialog,
    signupData, setSignupData,
    showDebug, setShowDebug,
    handleSubmit,
    handleForgotPassword,
    handleSignup,
    handleSocialLogin,
    handleTabChange,
    handleSignupInputChange
  } = useLoginState();

  const toggleDebugMode = () => {
    setShowDebug(!showDebug);
  };

  const toggleSignUpDialog = () => {
    setShowSignupDialog(!showSignupDialog);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Marketing Panel (left side) */}
      <MarketingPanel />
      
      {/* Login Form Area (right side) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
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
                email={forgotEmail} 
                setEmail={setForgotEmail} 
                isSubmitting={isSubmitting}
                onSubmit={handleForgotPassword}
                onCancel={() => setShowForgotPassword(false)}
              />
            ) : (
              <>
                {/* Login Form */}
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  userType={userType}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  onForgotPassword={() => setShowForgotPassword(true)}
                />
                
                {/* Social Login Options */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <SocialLoginButtons 
                  isSubmitting={isSubmitting}
                  onGoogleLogin={() => handleSocialLogin('google')}
                  onAppleLogin={() => handleSocialLogin('apple')}
                  onGithubLogin={() => handleSocialLogin('github')}
                />
                
                {/* Sign Up Option */}
                <div className="mt-4 text-center text-sm">
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleSignUpDialog}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </>
            )}
            
            {/* Debug toggle for development */}
            <button 
              onClick={toggleDebugMode} 
              className="text-xs text-muted-foreground hover:text-foreground mt-4"
            >
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            
            {showDebug && (
              <DebugSection 
                email={email} 
                userType={userType}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
        
        {/* Sign Up Dialog */}
        <SignupDialog
          isOpen={showSignupDialog}
          onClose={() => setShowSignupDialog(false)}
          data={signupData}
          onChange={handleSignupInputChange}
          onSubmit={handleSignup}
          isSubmitting={isSubmitting}
          userType={userType}
          onUserTypeChange={handleTabChange}
        />
      </div>
    </div>
  );
};

export default LoginPage;
