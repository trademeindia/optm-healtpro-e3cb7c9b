
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const PatientRouter: React.FC = () => {
  return (
    <>
      <Route
        path="/dashboard/patient"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <PlaceholderPage title="Patient Dashboard" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ai-analysis"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <PlaceholderPage title="AI Analysis Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/anatomy-map"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <PlaceholderPage title="Anatomy Map Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/biomarkers"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <PlaceholderPage title="Biomarkers Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/exercises"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <PlaceholderPage title="Exercises Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/health-apps"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <PlaceholderPage title="Health Apps Page" />
          </ProtectedRoute>
        }
      />
    </>
  );
};
