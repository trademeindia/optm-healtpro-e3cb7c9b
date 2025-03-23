
import { User, Session, SupabaseClient, AuthResponse } from '@supabase/supabase-js';

// Update the Provider type to use string instead of relying on the exported Provider
export type Provider = 'google' | 'facebook' | 'twitter' | 'github' | 'azure' | 'discord' | 'gitlab';

export interface AuthUser extends User {
  // Any additional user properties your app needs
  displayName?: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, metadata?: any) => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<{ data: {}; error: Error | null }>;
  socialLogin: (provider: Provider) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  supabase: SupabaseClient;
}
