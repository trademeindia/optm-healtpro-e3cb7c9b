
import React from 'react';
import { Input } from '@/components/ui/input';

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  userType: 'doctor' | 'patient' | 'receptionist' | 'admin';
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail, userType }) => {
  // Set placeholder based on user type
  const getPlaceholder = () => {
    if (userType === 'doctor') return 'doctor@example.com';
    if (userType === 'receptionist') return 'receptionist@example.com';
    if (userType === 'admin') return 'admin@example.com';
    return 'patient@example.com';
  };
  
  return (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Email
      </label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={getPlaceholder()}
        autoComplete="email"
        required
      />
    </div>
  );
};

export default EmailInput;
