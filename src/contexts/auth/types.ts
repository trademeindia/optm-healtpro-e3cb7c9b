
import { User as SupabaseUser } from '@supabase/supabase-js';

// Define available user roles
export type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist';

// Define OAuth providers - using string literals instead of importing Provider
export type Provider = 'google' | 'facebook' | 'twitter' | 'github' | 'azure' | 'apple';

// User model with role information
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  provider: string;
  picture: string | null;
  patientId?: string;
}

// Auth context interface
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithSocialProvider: (provider: Provider) => Promise<void>;
  handleOAuthCallback: (provider: string, code: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}
