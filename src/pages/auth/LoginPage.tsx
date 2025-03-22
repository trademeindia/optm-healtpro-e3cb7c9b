
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import SignupDialog from '@/components/auth/SignupDialog';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { useLoginState } from '@/hooks/useLoginState';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/pages/dashboard/components/ErrorBoundary';

const LoginPage: React.FC = () => {
  const {
    email, setEmail,
    password, setPassword,
    isSubmitting,
    showForgotPassword, setShowForgotPassword,
    forgotEmail, setForgotEmail,
    userType, setUserType,
    showSignupDialog, setShowSignupDialog,
    signupData, handleSignupInputChange,
    handleSubmit,
    handleForgotPassword,
    handleSignup,
    handleSocialLogin,
    handleTabChange,
  } = useLoginState();

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
          <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
            <h1 className="text-4xl font-bold mb-6">OPTM HealPro</h1>
            <h2 className="text-2xl font-semibold mb-4">Advanced Healthcare Platform</h2>
            <p className="text-lg mb-8 max-w-lg opacity-90">
              {userType === 'doctor' ? 
                'Access comprehensive patient data, motion analysis tools, and AI-powered diagnostics.' : 
                'Monitor your health progress, access personalized exercise plans, and connect with healthcare providers.'}
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="mr-2">✓</span> 
                {userType === 'doctor' ? 'Advanced motion analysis tools' : 'Personalized care plans'}
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> 
                {userType === 'doctor' ? 'AI-assisted diagnostics' : 'Exercise tracking and feedback'}
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> 
                {userType === 'doctor' ? 'Patient progress tracking' : 'Secure communication with providers'}
              </li>
            </ul>
          </div>
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
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  <>
                    {/* Social Login Options */}
                    <SocialLoginButtons 
                      onGoogleLogin={() => handleSocialLogin('google')}
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
                          onClick={() => setShowSignupDialog(true)}
                          className="text-primary hover:underline font-medium transition-colors"
                        >
                          Sign up
                        </button>
                      </p>
                    </motion.div>
                  </>
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
            isSubmitting={isSubmitting}
            userType={userType === 'receptionist' ? 'patient' : userType}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LoginPage;
