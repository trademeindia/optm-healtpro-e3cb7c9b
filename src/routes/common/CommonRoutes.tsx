
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';

// Lazy-loaded common components for settings, help, and shared routes
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const HelpPage = lazy(() => import('@/pages/help/HelpPage'));
const AppointmentsPage = lazy(() => import('@/pages/appointments/AppointmentsPage'));
const OpenSimPage = lazy(() => import('@/pages/opensim/OpenSimPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Patient-related pages accessible by doctors and receptionists
const PatientDetailsPage = lazy(() => import('@/pages/patients/PatientDetailsPage'));
const PatientsListPage = lazy(() => import('@/pages/patients/PatientsListPage'));

export const CommonRoutes: React.FC = () => {
  return (
    <>
      {/* Common Routes with Role-specific Access */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute requiredRole={[UserRole.DOCTOR, UserRole.RECEPTIONIST]}>
            <PatientsListPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute requiredRole={[UserRole.DOCTOR, UserRole.RECEPTIONIST]}>
            <PatientDetailsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/opensim"
        element={
          <ProtectedRoute>
            <OpenSimPage />
          </ProtectedRoute>
        }
      />
      
      {/* Settings and Help (accessible to all authenticated users) */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
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
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </>
  );
};
