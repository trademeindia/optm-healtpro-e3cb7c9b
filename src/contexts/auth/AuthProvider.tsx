
import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthSession } from './hooks/useAuthSession';
import { useAuthOperations } from './hooks/useAuthOperations';
import { User, UserRole } from './types';
import { toast } from 'sonner';
import { supabase, withRetry, checkSupabaseConnection } from '@/integrations/supabase/client';
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
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    console.log("Auth state updated:", { 
      user: user ? `${user.email} (${user.role})` : 'null', 
      sessionLoading, 
      operationsLoading,
      isLoggingOut,
      supabaseStatus
    });
  }, [user, sessionLoading, operationsLoading, isLoggingOut, supabaseStatus]);

  // Check Supabase connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        setSupabaseStatus(isConnected ? 'online' : 'offline');
        
        if (!isConnected) {
          toast.error("Supabase connection issue detected", {
            description: "Some features may be unavailable. Using local fallbacks when possible.",
            duration: 6000,
          });
        }
      } catch (e) {
        console.error('Supabase connection check failed:', e);
        setSupabaseStatus('offline');
      }
    };
    
    checkConnection();
    
    // Periodically check connection status
    const interval = setInterval(checkConnection, 60000); // Check every minute
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await withRetry(
          () => supabase.auth.getSession(),
          { showToastOnError: false }
        );
        
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
      // Demo accounts always work even if Supabase is offline
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
      
      // For non-demo users, use the enhanced login with retry logic
      if (supabaseStatus === 'offline') {
        toast.error('Cannot login while Supabase is offline', {
          description: 'Please use a demo account or try again later.',
          duration: 5000
        });
        return null;
      }
      
      return await withRetry(
        () => loginBase(email, password),
        {
          showToastOnError: true,
          errorMessage: "Login failed"
        }
      );
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
      // Call the base logout function with retry for reliability
      if (supabaseStatus === 'online') {
        await withRetry(
          () => logoutBase(),
          { showToastOnError: false }
        );
      } else {
        // In offline mode, just do local cleanup
        console.log('Supabase offline, skipping remote logout');
        await logoutBase();
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleOAuthCallback = async (provider: string, code: string) => {
    console.log("AuthProvider handling OAuth callback:", { provider, hasCode: !!code });
    try {
      if (supabaseStatus === 'offline') {
        toast.error('Cannot complete OAuth while Supabase is offline', {
          description: 'Please try again later when service is restored.',
          duration: 5000
        });
        throw new Error('Supabase is currently offline');
      }
      
      return await withRetry(
        () => handleOAuthCallbackBase(provider, code, user),
        { 
          showToastOnError: true,
          errorMessage: `${provider} authentication failed`
        }
      );
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
        supabaseStatus,
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
