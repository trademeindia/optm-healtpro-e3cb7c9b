
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useLoginState = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [userType, setUserType] = useState<'doctor' | 'patient'>('doctor');
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showDebug, setShowDebug] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const { login, loginWithSocialProvider, signup, forgotPassword, isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log(`Attempting to login with: ${email}`);
      const result = await login(email, password);
      
      if (result) {
        console.log('Login successful, user:', result);
        toast.success('Login successful!');
        
        // Manually navigate to dashboard based on user role
        setTimeout(() => {
          const dashboard = result.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
          console.log(`Navigating to ${dashboard}`);
          navigate(dashboard);
        }, 500);
      } else {
        setLoginAttempts(prev => prev + 1);
        console.error('Login failed: No user returned');
        toast.error('Login failed', { 
          description: 'Please check your credentials and try again'
        });
      }
    } catch (error: any) {
      setLoginAttempts(prev => prev + 1);
      console.error('Login error:', error);
      toast.error('Login failed', { 
        description: error?.message || 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use an effect to redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard');
      const dashboard = user.role === 'doctor' ? '/dashboard' : '/patient-dashboard';
      navigate(dashboard);
    }
  }, [isAuthenticated, user, navigate]);

  // Reset states if too many login attempts
  useEffect(() => {
    if (loginAttempts >= 3) {
      toast.info('Having trouble logging in?', {
        description: 'Try using demo credentials: doctor@example.com / password123',
        duration: 6000,
      });
    }
  }, [loginAttempts]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await forgotPassword(forgotEmail);
      setShowForgotPassword(false);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast.error('Password reset failed', { 
        description: error?.message || 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signup(signupData.email, signupData.password, signupData.name, userType);
      setShowSignupDialog(false);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error('Signup failed', { 
        description: error?.message || 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Initiating Google OAuth login flow');
      await loginWithSocialProvider('google');
    } catch (error: any) {
      console.error('Error initiating Google login:', error);
      toast.error('Google login failed', { 
        description: error?.message || 'Please try again later'
      });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'github') => {
    try {
      console.log(`Initiating ${provider} OAuth login flow`);
      await loginWithSocialProvider(provider);
    } catch (error: any) {
      console.error(`${provider} login initiation failed:`, error);
      toast.error(`${provider} login failed`, { 
        description: error?.message || 'Please try again later'
      });
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'doctor' || value === 'patient') {
      setUserType(value);
      // Prefill with demo emails for easier testing
      setEmail(value === 'doctor' ? 'doctor@example.com' : 'patient@example.com');
      setPassword(''); // Always clear password for security
    }
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  return {
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
  };
};
