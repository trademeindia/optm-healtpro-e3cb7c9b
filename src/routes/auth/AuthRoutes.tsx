
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import SessionExpired from '@/pages/auth/SessionExpired';

// Lazy-loaded auth components
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const PasswordResetPage = lazy(() => import('@/pages/auth/PasswordResetPage'));
const PasswordRecoveryPage = lazy(() => import('@/pages/auth/PasswordRecoveryPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const Index = lazy(() => import('@/pages/Index'));

export const AuthRoutes: React.FC = () => {
  return (
    <>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />
      <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      <Route path="/session-expired" element={<SessionExpired />} />
      
      {/* Root redirect based on auth status */}
      <Route path="/" element={<Index />} />
    </>
  );
};
