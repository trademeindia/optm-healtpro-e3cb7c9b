
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getMockUserProfileFromProvider } from '@/utils/oauth';

type UserRole = 'doctor' | 'patient';
type AuthProvider = 'email' | 'google' | 'apple' | 'github';

type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider?: AuthProvider;
  picture?: string; // Added profile picture field
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocialProvider: (provider: AuthProvider) => Promise<void>;
  handleOAuthCallback: (provider: string, code: string) => Promise<void>; // New method
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function with support for different user roles
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, check credentials locally
      // In production, this would validate with a backend server
      if (email === 'doctor@example.com' && password === 'password123') {
        const userData: User = {
          id: '1',
          email: 'doctor@example.com',
          name: 'Dr. Nikolas Pascal',
          role: 'doctor',
          provider: 'email'
        };
        
        // Store user in state and localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success('Login successful');
        navigate('/dashboard');
      } else if (email === 'patient@example.com' && password === 'password123') {
        const userData: User = {
          id: '2',
          email: 'patient@example.com',
          name: 'Alex Johnson',
          role: 'patient',
          provider: 'email'
        };
        
        // Store user in state and localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success('Login successful');
        navigate('/patient-dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a new user in the backend
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9), // Generate mock ID
        email,
        name,
        role,
        provider: 'email'
      };
      
      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Account created successfully');
      navigate(role === 'doctor' ? '/dashboard' : '/patient-dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Improved social login function - now redirects to provider
  const loginWithSocialProvider = async (provider: AuthProvider) => {
    // In a real implementation, this would redirect to the provider's OAuth page
    window.location.href = `/oauth-callback?code=${Math.random().toString(36).substring(2, 15)}&state=mock-state&provider=${provider}`;
  };
  
  // New function to handle OAuth callbacks
  const handleOAuthCallback = async (provider: string, code: string) => {
    setIsLoading(true);
    try {
      // Simulate API call to exchange code for token
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get mock user profile that would come from the provider
      const profile = getMockUserProfileFromProvider(provider);
      
      if (!profile) {
        throw new Error(`Failed to get profile from ${provider}`);
      }
      
      // Generate random role for demo purposes
      // In a real app, the role would be stored in your database
      const isDoctor = Math.random() > 0.5;
      
      const userData: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: isDoctor ? 'doctor' : 'patient',
        provider: provider as AuthProvider,
        picture: profile.picture
      };
      
      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Navigate to the appropriate dashboard
      navigate(userData.role === 'doctor' ? '/dashboard' : '/patient-dashboard');
      
      return userData;
    } catch (error) {
      console.error(`${provider} OAuth handling failed:`, error);
      toast.error(`${provider} login failed`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info('You have been logged out');
    navigate('/login');
  };

  const forgotPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link');
      throw error;
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
