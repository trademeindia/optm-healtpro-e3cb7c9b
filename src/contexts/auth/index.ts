
import { AuthProvider } from './AuthProvider';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';
import { AuthContextType } from './types';

// Export the AuthProvider with a better name to avoid conflicts
export const AuthProviderComponent = AuthProvider;

// Export the context directly
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types
export * from './types';

// Export context
export { AuthContext };
