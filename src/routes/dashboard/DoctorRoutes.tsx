
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import MotionAnalysisPage from '@/pages/dashboard/doctor/motion-analysis';
import DoctorDashboard from '@/pages/dashboard/DoctorDashboard'; 
import { PlaceholderPage } from '@/components/PlaceholderPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from 'sonner';

// Error handler for doctor routes
const handleDoctorRouteError = (error: Error) => {
  console.error("Doctor route error:", error);
  toast.error("Error loading doctor content", {
    description: error.message || "There was a problem displaying this content"
  });
};

export const DoctorRoutes = () => {
  return (
    <>
      <Route
        path="/dashboard/doctor"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <ErrorBoundary onError={handleDoctorRouteError}>
              <DoctorDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/doctor/motion-analysis"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <ErrorBoundary onError={handleDoctorRouteError}>
              <MotionAnalysisPage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <ErrorBoundary onError={handleDoctorRouteError}>
              <PlaceholderPage title="Reports Page" />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics"
        element={
          <ProtectedRoute requiredRole={UserRole.DOCTOR}>
            <ErrorBoundary onError={handleDoctorRouteError}>
              <PlaceholderPage title="Analytics Page" />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
    </>
  );
};
