
import React from 'react';

interface LoginOptionsProps {
  onForgotPassword: () => void;
}

const LoginOptions: React.FC<LoginOptionsProps> = ({ onForgotPassword }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <input
          id="remember"
          type="checkbox"
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
          Remember me
        </label>
      </div>
      <button
        type="button"
        className="text-sm text-primary hover:text-primary/80 font-medium"
        onClick={onForgotPassword}
      >
        Forgot password?
      </button>
    </div>
  );
};

export default LoginOptions;
