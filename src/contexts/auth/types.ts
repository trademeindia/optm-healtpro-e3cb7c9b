
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'doctor' | 'patient' | 'receptionist';
  avatar?: string;
  settings?: UserSettings;
  metadata?: any;
}

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
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  signup: (email: string, password: string, role: 'doctor' | 'patient' | 'receptionist', name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
