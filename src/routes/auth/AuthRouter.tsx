
import React from 'react';
import { Route } from 'react-router-dom';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import SessionExpired from '@/components/SessionExpired';

export const AuthRouter: React.FC = () => {
  return (
    <>
      <Route path="/login" element={<PlaceholderPage title="Login Page" />} />
      <Route path="/signup" element={<PlaceholderPage title="Signup Page" />} />
      <Route path="/password-reset" element={<PlaceholderPage title="Password Reset Page" />} />
      <Route path="/password-recovery" element={<PlaceholderPage title="Password Recovery Page" />} />
      <Route path="/session-expired" element={<SessionExpired />} />
      <Route path="/" element={<PlaceholderPage title="Index Page" />} />
    </>
  );
};
