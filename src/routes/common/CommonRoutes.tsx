
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import { PlaceholderPage } from '@/components/PlaceholderPage';

// Lazy-loaded common components for settings, help, and shared routes
const HelpPage = lazy(() => import('@/pages/help/HelpPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const CommonRoutes: React.FC = () => {
  return (
    <>
      <Route
        path="/patients"
        element={
          <ProtectedRoute requiredRole={[UserRole.DOCTOR, UserRole.RECEPTIONIST]}>
            <PlaceholderPage title="Patients List Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute requiredRole={[UserRole.DOCTOR, UserRole.RECEPTIONIST]}>
            <PlaceholderPage title="Patient Details Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Appointments Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/opensim"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="OpenSim Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Settings Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFoundPage />} />
    </>
  );
};
