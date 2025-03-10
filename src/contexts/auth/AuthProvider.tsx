
import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthSession } from './hooks/useAuthSession';
import { useAuthOperations } from './hooks/useAuthOperations';
import { User, UserRole } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: sessionLoading, setUser } = useAuthSession();
  const {
    isLoading: operationsLoading,
    login: loginBase,
    signup,
    loginWithSocialProvider,
    handleOAuthCallback: handleOAuthCallbackBase,
    logout,
    forgotPassword
  } = useAuthOperations();

  // Combine loading states
  const isLoading = sessionLoading || operationsLoading;

  // Monitor auth state for debugging
  useEffect(() => {
    console.log("Auth state updated:", { 
      user: user ? `${user.email} (${user.role})` : 'null', 
      sessionLoading, 
      operationsLoading 
    });
  }, [user, sessionLoading, operationsLoading]);

  // Check Supabase session on mount
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
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase auth state change:', event, session ? 'session exists' : 'no session');
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Wrap login to update the user state for demo accounts
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      // Handle demo login
      if ((email === 'doctor@example.com' || email === 'patient@example.com') && password === 'password123') {
        console.log('Demo login attempt:', email);
        
        // Create demo user
        const demoUser: User = {
          id: `demo-${Date.now()}`,
          email: email,
          name: email === 'doctor@example.com' ? 'Dr. Demo Account' : 'Patient Demo',
          role: email === 'doctor@example.com' ? 'doctor' : 'patient',
          avatar: null,
          createdAt: new Date().toISOString()
        };
        
        setUser(demoUser);
        
        // Store in localStorage for persistence
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        
        toast.success('Demo login successful', {
          duration: 3000
        });
        
        return demoUser;
      }
      
      // Handle real login
      const user = await loginBase(email, password);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.', {
        duration: 5000
      });
      return null;
    }
  };

  // Wrap handleOAuthCallback to include the current user
  const handleOAuthCallback = async (provider: string, code: string) => {
    console.log("AuthProvider handling OAuth callback:", { provider, hasCode: !!code });
    try {
      // Pass the current user as the third argument
      return await handleOAuthCallbackBase(provider, code, user);
    } catch (error) {
      console.error('OAuth callback error:', error);
      toast.error('OAuth authentication failed. Please try again.', {
        duration: 5000
      });
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
