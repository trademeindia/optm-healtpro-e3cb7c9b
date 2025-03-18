import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthSession } from './hooks/useAuthSession';
import { useAuthOperations } from './hooks/useAuthOperations';
import { User, UserRole } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: sessionLoading, setUser } = useAuthSession();
  const {
    isLoading: operationsLoading,
    login: loginBase,
    signup,
    loginWithSocialProvider,
    handleOAuthCallback: handleOAuthCallbackBase,
    logout: logoutBase,
    forgotPassword
  } = useAuthOperations();

  const isLoading = sessionLoading || operationsLoading;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    console.log("Auth state updated:", { 
      user: user ? `${user.email} (${user.role})` : 'null', 
      sessionLoading, 
      operationsLoading,
      isLoggingOut
    });
  }, [user, sessionLoading, operationsLoading, isLoggingOut]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
        }
        console.log('Supabase session check:', data.session ? 'active' : 'none');
      } catch (e) {
        console.error('Supabase session check failed:', e);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase auth state change:', event, session ? 'session exists' : 'no session');
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      // Handle demo accounts with predefined roles and IDs
      if (email === 'admin@example.com' && password === 'password123') {
        const demoUser: User = {
          id: `demo-admin-${Date.now()}`,
          email: email,
          name: 'Admin Demo Account',
          role: 'admin',
          provider: 'email',
          picture: null
        };
        
        setUser(demoUser);
        toast.success('Admin demo login successful');
        return demoUser;
      }
      else if (email === 'doctor@example.com' && password === 'password123') {
        const demoUser: User = {
          id: `demo-doctor-${Date.now()}`,
          email: email,
          name: 'Dr. Demo Account',
          role: 'doctor',
          provider: 'email',
          picture: null
        };
        
        setUser(demoUser);
        toast.success('Demo login successful');
        return demoUser;
      }
      else if (email === 'patient@example.com' && password === 'password123') {
        const demoUser: User = {
          id: `demo-patient-${Date.now()}`,
          email: email,
          name: 'Patient Demo',
          role: 'patient',
          provider: 'email',
          picture: null,
          patientId: 'demo-patient-id-123' // Link to patient records
        };
        
        setUser(demoUser);
        toast.success('Demo login successful');
        return demoUser;
      }
      
      // Regular login for non-demo users
      return await loginBase(email, password);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      return null;
    }
  };

  const logout = async () => {
    // Set logging out state to prevent race conditions
    setIsLoggingOut(true);
    try {
      // Clear user state immediately to prevent UI flashing
      setUser(null);
      // Call the base logout function
      await logoutBase();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleOAuthCallback = async (provider: string, code: string) => {
    console.log("AuthProvider handling OAuth callback:", { provider, hasCode: !!code });
    try {
      return await handleOAuthCallbackBase(provider, code, user);
    } catch (error) {
      console.error('OAuth callback error:', error);
      toast.error('OAuth authentication failed. Please try again.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isLoading || isLoggingOut,
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
