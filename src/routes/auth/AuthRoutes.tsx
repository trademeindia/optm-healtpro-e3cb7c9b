
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import SessionExpired from '@/components/SessionExpired';

// Lazy-loaded auth components
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const PasswordResetPage = lazy(() => import('@/pages/auth/PasswordResetPage'));
const PasswordRecoveryPage = lazy(() => import('@/pages/auth/PasswordRecoveryPage'));
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
