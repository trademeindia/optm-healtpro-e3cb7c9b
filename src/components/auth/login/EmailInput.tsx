
import React from 'react';
import { Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  userType: 'doctor' | 'patient';
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  setEmail,
  userType
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
          onChange={handleInputChange}
          className="pl-10"
          placeholder={userType === 'doctor' ? "doctor@example.com" : "patient@example.com"}
          autoComplete="email"
          required
        />
      </div>
    </div>
  );
};

export default EmailInput;
