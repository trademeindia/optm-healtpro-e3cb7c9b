
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/useAuth';
import { toast } from 'sonner';
import { UserRole } from '@/contexts/auth/types';

export const useLoginState = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
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
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
        }
      } catch (error: any) {
        console.error('Demo login error:', error);
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
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    handleDemoLogin
  };
};
