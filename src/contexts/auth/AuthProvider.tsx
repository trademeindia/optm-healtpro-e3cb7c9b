
import React from 'react';
import { Provider } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';
import { useAuthSession } from './hooks/useAuthSession';
import { useAuthOperations } from './hooks/useAuthOperations';
import { User, UserRole } from './types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthSession();
  const {
    isLoading: operationsLoading,
    login,
    signup,
    loginWithSocialProvider,
    handleOAuthCallback: handleOAuthCallbackBase,
    logout,
    forgotPassword
  } = useAuthOperations();

  // Combine loading states
  const isAuthLoading = isLoading || operationsLoading;

  // Wrap handleOAuthCallback to include the current user
  const handleOAuthCallback = async (provider: string, code: string) => {
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
