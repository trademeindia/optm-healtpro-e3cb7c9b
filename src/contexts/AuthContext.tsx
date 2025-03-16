
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthContextType } from './auth/types';
import { Provider } from '@supabase/supabase-js';

// Mock user for development
const mockUser: User = {
  id: '1',
  email: 'doctor@example.com',
  name: 'Dr. John Smith',
  role: 'doctor',
  provider: 'email',
  picture: null
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => null,
  loginWithSocialProvider: async () => {},
  handleOAuthCallback: async () => {},
  signup: async () => null,
  logout: async () => {},
  forgotPassword: async () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading auth state
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.includes('doctor') ? 'Dr. John Smith' : 'Sarah Johnson',
        role: email.includes('doctor') ? 'doctor' : 'patient',
        provider: 'email',
        picture: null,
        patientId: email.includes('patient') ? 'patient-1' : undefined
      };
      
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocialProvider = async (provider: Provider) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'Social User',
        role: 'patient',
        provider,
        picture: null
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Social login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthCallback = async (provider: string, code: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: 'oauth@example.com',
        name: 'OAuth User',
        role: 'patient',
        provider: provider as Provider,
        picture: null
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('OAuth callback error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<User | null> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: '2',
        email,
        name,
        role,
        provider: 'email',
        picture: null,
        patientId: role === 'patient' ? 'patient-2' : undefined
      };
      
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithSocialProvider,
        handleOAuthCallback,
        signup,
        logout,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
