
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
  picture?: string | null;
  provider?: string;
  patientId?: string; // Added to fix errors
}

// Define the authentication context
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithSocialProvider?: (provider: string) => Promise<void>;
  handleOAuthCallback?: (provider: string, code: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User | null>;
  logout: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
}
