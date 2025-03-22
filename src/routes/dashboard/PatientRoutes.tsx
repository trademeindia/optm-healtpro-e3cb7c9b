
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';

// Lazy-loaded patient components
const PatientDashboard = lazy(() => import('@/pages/dashboard/patient/PatientDashboard'));
const AIAnalysisPage = lazy(() => import('@/pages/dashboard/patient/ai-analysis/AIAnalysisPage'));
const AnatomyMapPage = lazy(() => import('@/pages/dashboard/patient/anatomy-map/AnatomyMapPage'));
const BiomarkersPage = lazy(() => import('@/pages/dashboard/patient/biomarkers/BiomarkersPage'));
const ExercisesPage = lazy(() => import('@/pages/exercises/ExercisesPage'));
const HealthAppsPage = lazy(() => import('@/pages/dashboard/patient/health-apps/HealthAppsPage'));

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
            <AIAnalysisPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/anatomy-map"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <AnatomyMapPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/biomarkers"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <BiomarkersPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/exercises"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <ExercisesPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/health-apps"
        element={
          <ProtectedRoute requiredRole={UserRole.PATIENT}>
            <HealthAppsPage />
          </ProtectedRoute>
        }
      />
    </>
  );
};
