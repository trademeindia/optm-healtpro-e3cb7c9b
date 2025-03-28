
import { createContext, useContext } from 'react';
import { AuthContextType, User } from './types';
// Import Provider from types without re-exporting to avoid ambiguity
import type { Provider as AuthProvider } from './types';
import { AuthContext } from './AuthContext';

// Export the auth context hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types
export type { User, AuthContextType };
export type { AuthProvider };
export { AuthProvider as AuthProviderComponent } from './AuthProvider';

