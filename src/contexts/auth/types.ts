
// User role type definition
export type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist';

// Provider type definition
export type Provider = 'google' | 'facebook' | 'twitter' | 'github' | 'email';

// User type definition
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  provider: Provider;
  picture: string | null;
  patientId?: string;
}

// Auth context type definition
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: Error | null;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithSocialProvider: (provider: string) => Promise<void>;
  handleOAuthCallback: (provider: string, code: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

// Export Provider as a type to fix the re-export issue
// Using 'export type' when isolatedModules is enabled
export type { Provider };
