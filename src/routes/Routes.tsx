
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import OAuthCallback from '@/pages/OAuthCallback';
import ReportsPage from '@/pages/ReportsPage';

// Lazy load components
const DoctorDashboard = lazy(() => import('@/pages/dashboard/DoctorDashboard'));
const ReceptionistDashboard = lazy(() => import('@/pages/dashboard/ReceptionistDashboard'));
const PatientDashboard = lazy(() => import('@/pages/PatientDashboard'));

// Loading Component
const Loading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        
        {/* Doctor Routes */}
        <Route 
          path="/dashboard/doctor" 
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Patient Routes */}
        <Route 
          path="/dashboard/patient" 
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Receptionist Routes */}
        <Route 
          path="/dashboard/receptionist" 
          element={
            <ProtectedRoute requiredRole="receptionist">
              <ReceptionistDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Reports Route - Added explicit route */}
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute requiredRole="doctor">
              <ReportsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy Redirects */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/doctor" replace />} />
        <Route path="/patient-dashboard" element={<Navigate to="/dashboard/patient" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
