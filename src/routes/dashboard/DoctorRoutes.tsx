
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import MotionAnalysisPage from '@/pages/dashboard/doctor/motion-analysis';
import DoctorDashboard from '@/pages/dashboard/DoctorDashboard';
import { PlaceholderPage } from '@/components/PlaceholderPage';

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
            <PlaceholderPage title="Reports Page" />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <PlaceholderPage title="Analytics Page" />
          </ProtectedRoute>
        }
      />
    </>
  );
};
