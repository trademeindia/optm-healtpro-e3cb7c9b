
import React from 'react';
import { Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  userType: 'doctor' | 'patient' | 'receptionist';
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail, userType }) => {
  const getPlaceholder = () => {
    switch (userType) {
      case 'doctor':
        return 'doctor@example.com';
      case 'patient':
        return 'patient@example.com';
      case 'receptionist':
        return 'receptionist@example.com';
      default:
        return 'email@example.com';
    }
  };

  return (
    <div className="mb-4">
      <Label htmlFor="email">Email Address</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          placeholder={getPlaceholder()}
          required
        />
      </div>
    </div>
  );
};

export default EmailInput;
