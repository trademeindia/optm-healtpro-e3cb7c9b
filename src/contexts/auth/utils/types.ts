
import { User, Session, SupabaseClient, AuthResponse } from '@supabase/supabase-js';

// Define Provider type manually since it's not exported from supabase-js
export type Provider = 'google' | 'facebook' | 'twitter' | 'github' | 'azure' | 'discord' | 'gitlab';

export interface AuthSession {
  user: User | null;
  session: Session | null;
}

export interface AuthOperationResponse {
  success: boolean;
  error: Error | null;
  data?: any;
}

export interface AuthLoginCredentials {
  email: string;
  password: string;
}

export interface AuthSignupCredentials extends AuthLoginCredentials {
  metadata?: Record<string, any>;
}

export interface AuthStateManager {
  getSession: () => Promise<AuthSession>;
  subscribeToAuthChanges: (callback: (session: AuthSession) => void) => () => void;
}

export interface AuthOperations {
  login: (credentials: AuthLoginCredentials) => Promise<AuthResponse>;
  signup: (credentials: AuthSignupCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: {}; error: Error | null }>;
  socialAuth: (provider: Provider) => Promise<void>;
}

export interface UseAuthSessionOptions {
  onSessionUpdate?: (session: AuthSession) => void;
  onError?: (error: Error) => void;
}
