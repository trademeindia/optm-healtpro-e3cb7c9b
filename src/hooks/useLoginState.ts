
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useLoginState = () => {
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

  const { login, loginWithSocialProvider, signup, forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      alert('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signup(signupData.email, signupData.password, signupData.name, userType);
      setShowSignupDialog(false);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Initiating Google OAuth login flow');
      await loginWithSocialProvider('google');
    } catch (error) {
      console.error('Error initiating Google login:', error);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'github') => {
    try {
      console.log(`Initiating ${provider} OAuth login flow`);
      await loginWithSocialProvider(provider);
    } catch (error) {
      console.error(`${provider} login initiation failed:`, error);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'doctor' || value === 'patient') {
      setUserType(value);
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
