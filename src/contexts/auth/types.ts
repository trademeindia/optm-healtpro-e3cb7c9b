
import { Provider } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'doctor' | 'patient';
export type AuthProviderType = 'email' | 'github' | 'google' | 'apple' | 'facebook' | 'twitter';
export type SupabaseConnectionStatus = 'checking' | 'online' | 'offline';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider: AuthProviderType;
  picture: string | null;
  patientId?: string; // Optional field to link patient users to their records
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  supabaseStatus: SupabaseConnectionStatus;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User | null>;
  loginWithSocialProvider: (provider: Provider) => Promise<void>;
  handleOAuthCallback: (provider: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}
