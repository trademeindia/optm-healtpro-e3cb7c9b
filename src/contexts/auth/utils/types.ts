
import { UserRole } from '../types';
import type { Provider } from '../types';

// Re-export User type from Supabase but with our custom structure
export interface SupabaseUser {
  id: string;
  email?: string;
  app_metadata?: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata?: {
    name?: string;
    role?: UserRole;
    avatar_url?: string;
    [key: string]: any;
  };
}

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  provider: Provider;
  picture: string | null;
}
