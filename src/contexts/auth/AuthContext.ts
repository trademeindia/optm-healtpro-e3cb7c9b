
import { createContext } from 'react';
import { AuthContextType } from './types';

// Create the auth context with a more complete initial state
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,
  login: async () => null,
  loginWithSocialProvider: async () => {},
  handleOAuthCallback: async () => {},
  signup: async () => null,
  logout: async () => {},
  forgotPassword: async () => {},
});

AuthContext.displayName = 'AuthContext'; // This helps with React DevTools debugging
