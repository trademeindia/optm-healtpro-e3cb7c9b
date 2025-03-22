
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/useAuth';
import { toast } from 'sonner';
import { UserRole } from '@/contexts/auth/types';

export const useLoginState = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear any error when user types
    setLoginErrors([]);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear any error when user types
    setLoginErrors([]);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset errors
    setLoginErrors([]);
    
    // Validate inputs
    const errors: string[] = [];
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    
    if (errors.length > 0) {
      setLoginErrors(errors);
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      
      if (user) {
        // Navigate based on user role
        if (user.role === UserRole.DOCTOR) {
          navigate('/dashboard/doctor');
        } else if (user.role === UserRole.PATIENT) {
          navigate('/dashboard/patient');
        } else if (user.role === UserRole.RECEPTIONIST) {
          navigate('/dashboard/receptionist');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginErrors([error.message || 'Failed to login. Please check your credentials.']);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, navigate]);

  const handleDemoLogin = useCallback((role: 'doctor' | 'patient' | 'receptionist') => {
    setIsLoading(true);
    
    const demoCredentials = {
      doctor: { email: 'doctor@example.com', password: 'password123' },
      patient: { email: 'patient@example.com', password: 'password123' },
      receptionist: { email: 'receptionist@example.com', password: 'password123' }
    };
    
    const credentials = demoCredentials[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
    
    // Small timeout to ensure state updates before submission
    setTimeout(async () => {
      try {
        const user = await login(credentials.email, credentials.password);
        
        if (user) {
          const dashboardRoute = `/dashboard/${role}`;
          navigate(dashboardRoute);
        } else {
          throw new Error('Demo login failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Demo login error:', error);
        setLoginErrors([error.message || 'Failed to login with demo account.']);
        toast.error(error.message || 'Failed to login with demo account.');
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }, [login, navigate]);

  return {
    email,
    password,
    isLoading,
    errors: loginErrors,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    handleDemoLogin
  };
};
