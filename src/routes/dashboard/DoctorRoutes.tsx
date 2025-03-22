
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';

// Lazy-loaded doctor components
const DoctorDashboard = lazy(() => import('@/pages/dashboard/doctor/DoctorDashboard'));
const MotionAnalysisPage = lazy(() => import('@/pages/dashboard/doctor/motion-analysis'));
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'));
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'));

export const DoctorRoutes: React.FC = () => {
  return (
    <>
      <Route
        path="/dashboard/doctor"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/doctor/motion-analysis"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <MotionAnalysisPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
    </>
  );
};
