
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import { PlaceholderPage } from '@/components/PlaceholderPage';

// Lazy-loaded patient components
const PatientDashboard = lazy(() => import('@/pages/dashboard/patient/PatientDashboard'));

export const PatientRoutes: React.FC = () => {
  return (
    <>
      <Route
        path="/dashboard/patient"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <PatientDashboard />
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
