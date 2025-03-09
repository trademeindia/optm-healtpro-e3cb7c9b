
import React, { useEffect } from 'react';
import { Provider } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';
import { useAuthSession } from './hooks/useAuthSession';
import { useAuthOperations } from './hooks/useAuthOperations';
import { User, UserRole } from './types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, setUser } = useAuthSession();
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
  const isAuthLoading = isLoading || operationsLoading;

  // Monitor auth state for debugging
  useEffect(() => {
    console.log("Auth state updated:", { 
      user: user ? `${user.email} (${user.role})` : 'null', 
      isLoading, 
      operationsLoading 
    });
  }, [user, isLoading, operationsLoading]);

  // Wrap login to update the user state for demo accounts
  const login = async (email: string, password: string): Promise<User | null> => {
    const user = await loginBase(email, password);
    
    // If this is a demo login, update the user state manually since we're bypassing Supabase auth
    if (user && (email === 'doctor@example.com' || email === 'patient@example.com') && password === 'password123') {
      setUser(user);
      
      // Handle navigation after setting the user
      if (user.role === 'doctor') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/patient-dashboard';
      }
    }
    
    return user;
  };

  // Wrap handleOAuthCallback to include the current user
  const handleOAuthCallback = async (provider: string, code: string) => {
    console.log("AuthProvider handling OAuth callback:", { provider, hasCode: !!code, hasUser: !!user });
    // The issue is here - we need to pass the user object as the third argument
    return handleOAuthCallbackBase(provider, code, user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isAuthLoading,
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
