
import { createContext, useContext } from 'react';
import { AuthContextType, User } from './types';
// Import Provider from types without re-exporting to avoid ambiguity
import type { Provider as AuthProvider } from './types';

// Create the auth context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => null,
  loginWithSocialProvider: async () => {},
  handleOAuthCallback: async () => {},
  signup: async () => null,
  logout: async () => {},
  forgotPassword: async () => {},
});

// Export the auth context hook
export const useAuth = () => useContext(AuthContext);

// Export types
export type { User };
export type { AuthProvider };
export { AuthProvider as AuthProviderComponent } from './AuthProvider';
