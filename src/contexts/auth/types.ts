
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'doctor' | 'patient' | 'receptionist' | 'admin';
  avatar?: string;
  settings?: UserSettings;
  metadata?: any;
  patientId?: string;
  provider?: AuthProviderType;
  picture?: string;
}

export type AuthProviderType = 'email' | 'google' | 'github' | 'apple';

export type UserRole = 'doctor' | 'patient' | 'receptionist' | 'admin';

export interface UserSettings {
  darkMode?: boolean;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  language?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithSocialProvider: (provider: 'google' | 'apple' | 'github') => Promise<void>;
  handleOAuthCallback: (provider: string, code: string, existingUser?: User | null) => Promise<any>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export interface OAuthResponseType {
  status: 'success' | 'error';
  message?: string;
  code?: string;
  provider?: string;
  action?: string;
}
