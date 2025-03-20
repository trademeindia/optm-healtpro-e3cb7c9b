
import React from 'react';
import { Button } from '@/components/ui/button';
import EmailInput from './login/EmailInput';
import PasswordInput from './login/PasswordInput';
import LoginOptions from './login/LoginOptions';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  userType: 'doctor' | 'patient' | 'receptionist';
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  userType,
  isSubmitting,
  onSubmit,
  onForgotPassword
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <EmailInput 
        email={email}
        setEmail={setEmail}
        userType={userType}
      />
      
      <PasswordInput
        password={password}
        setPassword={setPassword}
      />
      
      <LoginOptions onForgotPassword={onForgotPassword} />
      
      <Button
        type="submit"
        className="w-full py-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default LoginForm;
