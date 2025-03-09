
import { Provider } from '@supabase/supabase-js';

export type UserRole = 'doctor' | 'patient';
export type AuthProviderType = Provider | 'email';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider?: AuthProviderType;
  picture?: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocialProvider: (provider: Provider) => Promise<void>;
  handleOAuthCallback: (provider: string, code: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
};
