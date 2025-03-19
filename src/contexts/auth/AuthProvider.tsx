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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Auth state updated:", { 
      user: user ? `${user.email} (${user.role})` : 'null', 
      sessionLoading, 
      operationsLoading 
    });
  }, [user, sessionLoading, operationsLoading]);

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
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase auth state change:', event, session ? 'session exists' : 'no session');
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        const { formatUser } = await import('./utils');
        try {
          const formattedUser = await formatUser(session.user);
          if (formattedUser && !user) {
            console.log('Updating user state after auth state change:', formattedUser);
            setUser(formattedUser);
          }
        } catch (error) {
          console.error('Error formatting user after auth state change:', error);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, user]);

  const login = async (email: string, password: string): Promise<User | null> => {
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
    else if (email === 'receptionist@example.com' && password === 'password123') {
      const demoUser: User = {
        id: `demo-receptionist-${Date.now()}`,
        email: email,
        name: 'Receptionist Demo Account',
        role: 'admin',
        provider: 'email',
        picture: null
      };
      
      setUser(demoUser);
      toast.success('Receptionist demo login successful');
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
        patientId: 'demo-patient-id-123'
      };
      
      setUser(demoUser);
      toast.success('Demo login successful');
      return demoUser;
    }
    
    return await loginBase(email, password);
  };

  const handleOAuthCallback = async (provider: string, code: string) => {
    console.log("AuthProvider handling OAuth callback:", { provider, hasCode: !!code });
    try {
      return await handleOAuthCallbackBase(provider, code, user);
    } catch (error) {
      console.error('OAuth callback error:', error);
      toast.error('OAuth authentication failed. Please try again.');
      setError(error as Error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    console.log("Update profile:", data);
    try {
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({ ...user, ...data });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setError(error as Error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        loginWithSocialProvider,
        handleOAuthCallback,
        signup,
        logout,
        forgotPassword,
        updateProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
