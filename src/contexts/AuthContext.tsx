
// This file re-exports from the refactored auth module for backward compatibility
export { useAuth, AuthProviderComponent as AuthProvider } from './auth';
export type { User, UserRole, AuthContextType } from './auth/types';
