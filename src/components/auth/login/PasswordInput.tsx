
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-6">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10"
          placeholder="••••••••"
          required
        />
        <button 
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? 
            <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
            <Eye className="h-5 w-5 text-muted-foreground" />
          }
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
