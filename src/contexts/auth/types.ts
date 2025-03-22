
// Define the user roles as an enum
export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
  RECEPTIONIST = 'receptionist'
}

// Define the authentication context state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Define the user object structure
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
  provider?: string;
  patientId?: string; // Added to fix errors
}

// Define the authentication context
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  socialAuth: (provider: string) => Promise<void>;
  
  // Adding missing methods
  forgotPassword?: (email: string) => Promise<void>;
  loginWithSocialProvider?: (provider: string) => Promise<void>;
  handleOAuthCallback?: (params: URLSearchParams) => Promise<void>;
}
