
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRole } from '@/contexts/auth/types';

export const useLoginState = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [userType, setUserType] = useState<'doctor' | 'patient' | 'receptionist'>('doctor');
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showDebug, setShowDebug] = useState(false);

  const { login, loginWithSocialProvider, signup, forgotPassword, isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Map UI user type to backend role
      const role: UserRole = userType === 'receptionist' ? 'admin' : (userType as UserRole);
      
      // For demo logins, use predefined emails
      let loginEmail = email;
      if (userType === 'receptionist' && email === 'receptionist@example.com') {
        loginEmail = 'receptionist@example.com'; // Keep as is for demo login
      }
      
      const result = await login(loginEmail, password);
      
      if (result) {
        console.log('Login successful, redirecting to dashboard');
        // Manually navigate to dashboard based on user role
        setTimeout(() => {
          let dashboard;
          switch(result.role) {
            case 'doctor':
              dashboard = '/dashboard';
              break;
            case 'admin': // For receptionist
              dashboard = '/receptionist-dashboard';
              break;
            case 'patient':
            default:
              dashboard = '/patient-dashboard';
          }
          console.log(`Navigating to ${dashboard}`);
          navigate(dashboard);
        }, 500);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use an effect to redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard');
      let dashboard;
      switch(user.role) {
        case 'doctor':
          dashboard = '/dashboard';
          break;
        case 'admin': // For receptionist
          dashboard = '/receptionist-dashboard';
          break;
        case 'patient':
        default:
          dashboard = '/patient-dashboard';
      }
      navigate(dashboard);
    }
  }, [isAuthenticated, user, navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await forgotPassword(forgotEmail);
      setShowForgotPassword(false);
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.email || !signupData.password) {
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Map UI user type to backend role
      const role: UserRole = userType === 'receptionist' ? 'admin' : (userType as UserRole);
      await signup(signupData.email, signupData.password, signupData.name, role);
      setShowSignupDialog(false);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      console.log('Initiating Google OAuth login flow');
      toast.info('Connecting to Google...', { duration: 3000 });
      await loginWithSocialProvider('google');
    } catch (error) {
      console.error('Error initiating Google login:', error);
      toast.error('Google login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'github') => {
    try {
      setIsSubmitting(true);
      console.log(`Initiating ${provider} OAuth login flow`);
      toast.info(`Connecting to ${provider}...`, { duration: 3000 });
      await loginWithSocialProvider(provider);
    } catch (error) {
      console.error(`${provider} login initiation failed:`, error);
      toast.error(`${provider} login failed. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'doctor' || value === 'patient' || value === 'receptionist') {
      setUserType(value as 'doctor' | 'patient' | 'receptionist');
      setEmail('');
      setPassword('');
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
