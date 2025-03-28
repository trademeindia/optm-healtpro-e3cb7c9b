
export type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist';

export type Provider = 'google' | 'apple' | 'facebook' | 'twitter' | 'email' | 'github' | 'azure';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  provider: Provider;
  picture: string | null;
  patientId?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError?: Error | null;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithSocialProvider: (provider: string) => Promise<void>;
  handleOAuthCallback: (provider: string, code: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

