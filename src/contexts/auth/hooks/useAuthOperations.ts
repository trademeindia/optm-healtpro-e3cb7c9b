
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { useAuthLogin } from './useAuthLogin';
import { useAuthSignup } from './useAuthSignup';
import { useAuthManagement } from './useAuthManagement';
import { useSocialProviderAuth } from './social/useSocialProviderAuth';
import { useOAuthCallbackHandler } from './social/useOAuthCallbackHandler';

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Initialize hooks
  const { login } = useAuthLogin({ setIsLoading, navigate });
  const { signup } = useAuthSignup({ setIsLoading, navigate });
  const { logout, forgotPassword } = useAuthManagement({ navigate });
  const { loginWithSocialProvider } = useSocialProviderAuth({ setIsLoading });
  const { handleOAuthCallback } = useOAuthCallbackHandler({ setIsLoading, navigate });

  return {
    isLoading,
    setIsLoading,
    login,
    signup,
    loginWithSocialProvider,
    handleOAuthCallback,
    logout,
    forgotPassword
  };
};
