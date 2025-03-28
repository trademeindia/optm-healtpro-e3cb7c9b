
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
    logout,
    forgotPassword
  } = useAuthOperations();

  const isLoading = sessionLoading || operationsLoading;
  const [lastAuthEvent, setLastAuthEvent] = useState<string | null>(null);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Add debugging logger for auth state changes
  useEffect(() => {
    console.log("Auth state updated:", { 
      user: user ? `${user.email} (${user.role})` : 'null', 
      sessionLoading, 
      operationsLoading,
      lastAuthEvent
    });
  }, [user, sessionLoading, operationsLoading, lastAuthEvent]);

  // Enhance Supabase auth state monitoring with better error handling
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          setAuthError(error);
        }
        console.log('Supabase session check:', data.session ? 'active' : 'none');
      } catch (e) {
        console.error('Supabase session check failed:', e);
        setAuthError(e instanceof Error ? e : new Error('Unknown session error'));
      }
    };
    
    checkSession();
    
    let lastEventTimestamp = Date.now();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Prevent duplicate events in short timespan
      const now = Date.now();
      const timeSinceLastEvent = now - lastEventTimestamp;
      
      console.log('Supabase auth state change:', event, session ? 'session exists' : 'no session', 
        `(${timeSinceLastEvent}ms since last event)`);

      setLastAuthEvent(event);
      
      // Debounce too frequent events (possible infinite loop protection)
      if (timeSinceLastEvent < 100 && event === lastAuthEvent) {
        console.warn('Auth event debounced - too frequent!');
        return;
      }
      
      lastEventTimestamp = now;
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('demoUser');
      }
      
      // Use setTimeout to avoid potential deadlocks in auth state changes
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        setTimeout(async () => {
          try {
            const { formatUser } = await import('./utils');
            const formattedUser = await formatUser(session.user);
            if (formattedUser && !user) {
              console.log('Updating user state after auth state change:', formattedUser);
              setUser(formattedUser);
            }
          } catch (error) {
            console.error('Error formatting user after auth state change:', error);
            setAuthError(error instanceof Error ? error : new Error('Unknown formatting error'));
          }
        }, 0);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, user, lastAuthEvent]);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      if (email === 'admin@example.com' && password === 'password123') {
        const demoUser: User = {
          id: `demo-admin-${Date.now()}`,
          email: email,
          name: 'Admin Demo Account',
          role: 'admin' as UserRole,
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
          role: 'doctor' as UserRole,
          provider: 'email',
          picture: null
        };
        
        setUser(demoUser);
        toast.success('Doctor demo login successful');
        return demoUser;
      }
      else if (email === 'patient@example.com' && password === 'password123') {
        const demoUser: User = {
          id: `demo-patient-${Date.now()}`,
          email: email,
          name: 'Patient Demo',
          role: 'patient' as UserRole,
          provider: 'email',
          picture: null,
          patientId: 'demo-patient-id-123'
        };
        
        setUser(demoUser);
        toast.success('Patient demo login successful');
        return demoUser;
      }
      else if (email === 'receptionist@example.com' && password === 'password123') {
        const demoUser: User = {
          id: `demo-receptionist-${Date.now()}`,
          email: email,
          name: 'Receptionist Demo',
          role: 'receptionist' as UserRole,
          provider: 'email',
          picture: null
        };
        
        setUser(demoUser);
        toast.success('Receptionist demo login successful');
        return demoUser;
      }
      
      return await loginBase(email, password);
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error instanceof Error ? error : new Error('Unknown login error'));
      toast.error('Login failed. Please check your credentials and try again.');
      return null;
    }
  };

  const handleOAuthCallback = async (provider: string, code: string): Promise<void> => {
    console.log("AuthProvider handling OAuth callback:", { provider, hasCode: !!code });
    try {
      await handleOAuthCallbackBase(provider, code, user);
    } catch (error) {
      console.error('OAuth callback error:', error);
      setAuthError(error instanceof Error ? error : new Error('Unknown OAuth error'));
      toast.error('OAuth authentication failed. Please try again.');
      throw error;
    }
  };

  // Graceful logout with better error handling
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state to prevent UI issues
      setUser(null);
      localStorage.removeItem('demoUser');
      setAuthError(error instanceof Error ? error : new Error('Unknown logout error'));
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
        logout: handleLogout,
        forgotPassword,
        authError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

