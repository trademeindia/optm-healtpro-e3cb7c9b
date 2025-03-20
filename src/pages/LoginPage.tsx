
import React from 'react';
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Marketing Panel (left side) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/public/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png')] bg-center bg-no-repeat bg-cover opacity-10"></div>
        <MarketingPanel userType={userType === 'receptionist' ? 'doctor' : userType} />
      </div>
      
      {/* Login Form Area (right side) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 backdrop-blur-sm">
        <Card className="w-full max-w-md shadow-xl border border-white/20 dark:border-white/5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
          <CardHeader className="space-y-1">
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
                isSubmitting={isSubmitting}
              />
            ) : (
              <>
                {/* Social Login Options */}
                <SocialLoginButtons 
                  onGoogleLogin={() => handleSocialLogin('google')}
                  onSocialLogin={handleSocialLogin}
                  isSubmitting={isSubmitting}
                />
                
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
        
        {/* Sign Up Dialog */}
        <SignupDialog
          showSignupDialog={showSignupDialog}
          setShowSignupDialog={setShowSignupDialog}
          signupData={signupData}
          handleSignupInputChange={handleSignupInputChange}
          handleSignup={handleSignup}
          isSubmitting={isSubmitting}
          userType={userType === 'receptionist' ? 'patient' : userType}
        />
      </div>
    </div>
  );
};

export default LoginPage;
