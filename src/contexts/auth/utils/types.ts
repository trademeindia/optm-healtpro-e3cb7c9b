
import { User as SupabaseUser } from '@supabase/supabase-js';

// Define OAuth providers - using string literals
export type Provider = 'google' | 'facebook' | 'twitter' | 'github' | 'azure' | 'apple';

// User session interface
export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  role: string;
  provider: string;
  picture: string | null;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    provider: string;
    picture: string | null;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Mapping of provider names to display values
export const providerDisplayNames: Record<Provider | string, string> = {
  google: 'Google',
  facebook: 'Facebook',
  twitter: 'Twitter',
  github: 'GitHub',
  azure: 'Microsoft',
  apple: 'Apple',
  email: 'Email',
};

// Authentication errors
export type AuthError = {
  message: string;
  status?: number;
  details?: any;
};
