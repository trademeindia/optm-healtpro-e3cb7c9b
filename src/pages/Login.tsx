
import React from 'react';
import { useAuth } from '@/contexts/auth'; // Fix the import to match actual context path
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

// Import new components 
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import SignupDialog from '@/components/auth/SignupDialog';
import MarketingPanel from '@/components/auth/MarketingPanel';
import DebugSection from '@/components/auth/DebugSection';
import { useLoginState } from '@/hooks/useLoginState';

const Login: React.FC = () => {
  const { 
    email, setEmail,
    password, setPassword,
    isSubmitting, setIsSubmitting,
    showForgotPassword, setShowForgotPassword,
    forgotEmail, setForgotEmail,
    userType, setUserType,
    showSignupDialog, setShowSignupDialog,
    signupData, setSignupData,
    showDebug, setShowDebug,
    handleSubmit,
    handleForgotPassword,
    handleSignup,
    handleGoogleLogin,
    handleSocialLogin,
    handleTabChange,
    handleSignupInputChange
  } = useLoginState();

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient ml-4">OPTM HealPro</h1>
          </div>
          
          {!showForgotPassword ? (
            <>
              <UserTypeSelector userType={userType} onTabChange={handleTabChange} />
              
              <SocialLoginButtons 
                onGoogleLogin={handleGoogleLogin}
                onSocialLogin={handleSocialLogin}
                isSubmitting={isSubmitting}
              />
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">or</span>
                </div>
              </div>
              
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
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80 font-medium"
                    onClick={() => setShowSignupDialog(true)}
                  >
                    Sign up
                  </button>
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-center text-sm text-muted-foreground">
                  {userType === 'doctor' 
                    ? 'Demo: doctor@example.com / password123' 
                    : 'Demo: patient@example.com / password123'}
                </p>
              </div>
              
              <DebugSection 
                showDebug={showDebug} 
                setShowDebug={setShowDebug} 
              />
            </>
          ) : (
            <ForgotPasswordForm 
              forgotEmail={forgotEmail}
              setForgotEmail={setForgotEmail}
              onSubmit={handleForgotPassword}
              onBackToLogin={() => setShowForgotPassword(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </div>
      
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary to-accent p-10">
        <MarketingPanel userType={userType} />
      </div>
      
      <SignupDialog 
        showSignupDialog={showSignupDialog}
        setShowSignupDialog={setShowSignupDialog}
        signupData={signupData}
        handleSignupInputChange={handleSignupInputChange}
        handleSignup={handleSignup}
        isSubmitting={isSubmitting}
        userType={userType}
      />
    </div>
  );
};

export default Login;
