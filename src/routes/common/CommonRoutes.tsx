
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import { PlaceholderPage } from '@/components/PlaceholderPage';

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
            <PlaceholderPage title="Help Page" />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Not Found */}
      <Route path="*" element={<PlaceholderPage title="Not Found Page" />} />
    </>
  );
};
