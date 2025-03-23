
import React from 'react';
import { Route } from 'react-router-dom';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import SessionExpired from '@/components/SessionExpired';
import LoginPage from '@/pages/LoginPage';
import Index from '@/pages/Index';

export const AuthRoutes = () => {
  return (
    <>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<PlaceholderPage title="Signup Page" />} />
      <Route path="/password-reset" element={<PlaceholderPage title="Password Reset Page" />} />
      <Route path="/password-recovery" element={<PlaceholderPage title="Password Recovery Page" />} />
      <Route path="/session-expired" element={<SessionExpired />} />
      
      {/* Root redirect based on auth status */}
      <Route path="/" element={<Index />} />
    </>
  );
};
