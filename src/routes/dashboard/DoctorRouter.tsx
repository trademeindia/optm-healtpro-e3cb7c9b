
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import MotionAnalysisPage from '@/pages/dashboard/doctor/motion-analysis';

export const DoctorRouter: React.FC = () => {
  return (
    <>
      <Route
        path="/dashboard/doctor"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <PlaceholderPage title="Doctor Dashboard" />
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
