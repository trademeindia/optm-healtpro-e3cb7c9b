
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthProviderProps, AuthUser } from './types';
import { useAuthLogin } from './hooks/useAuthLogin';
import { useAuthSignup } from './hooks/useAuthSignup';
import { useAuthManagement } from './hooks/useAuthManagement';
import { useAuthSocial } from './hooks/useAuthSocial';
import { Provider } from './utils/types';

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, supabase }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { login } = useAuthLogin(supabase);
  const { signUp } = useAuthSignup(supabase);
  const { logout, resetPassword } = useAuthManagement(supabase);
  const { socialAuth } = useAuthSocial(supabase);

  useEffect(() => {
    let mounted = true;
    
    const checkSession = async () => {
      try {
        // Get the initial session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          const currentSession = data.session;
          setSession(currentSession);
          setUser(currentSession?.user as AuthUser || null);
          setIsAuthenticated(!!currentSession);
        }
      } catch (err) {
        if (mounted) {
          console.error('Session error:', err);
          setError(err instanceof Error ? err : new Error('Session error'));
          setIsError(true);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user as AuthUser || null);
          setIsAuthenticated(!!newSession);
        }
      }
    );
    
    // Check initial session
    checkSession();
    
    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const clearError = () => {
    setError(null);
    setIsError(false);
  };

  // Provide the auth context value
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    isError,
    error,
    login,
    signUp,
    resetPassword,
    socialLogin: (provider: Provider) => socialAuth(provider),
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
