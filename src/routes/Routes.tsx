
import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import SessionExpired from '@/pages/auth/SessionExpired';

// Lazy-loaded components
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const PasswordResetPage = lazy(() => import('@/pages/auth/PasswordResetPage'));
const PasswordRecoveryPage = lazy(() => import('@/pages/auth/PasswordRecoveryPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const Index = lazy(() => import('@/pages/Index'));

// Dashboard
const DoctorDashboard = lazy(() => import('@/pages/dashboard/doctor/DoctorDashboard'));
const PatientDashboard = lazy(() => import('@/pages/dashboard/patient/PatientDashboard'));
const ReceptionistDashboard = lazy(() => import('@/pages/dashboard/receptionist/ReceptionistDashboard'));

// Patient-related pages
const PatientDetailsPage = lazy(() => import('@/pages/patients/PatientDetailsPage'));
const PatientsListPage = lazy(() => import('@/pages/patients/PatientsListPage'));

// Reports and other pages
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'));
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'));
const AppointmentsPage = lazy(() => import('@/pages/appointments/AppointmentsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const HelpPage = lazy(() => import('@/pages/help/HelpPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Patient-specific pages
const AIAnalysisPage = lazy(() => import('@/pages/dashboard/patient/ai-analysis/AIAnalysisPage'));
const AnatomyMapPage = lazy(() => import('@/pages/dashboard/patient/anatomy-map/AnatomyMapPage'));
const BiomarkersPage = lazy(() => import('@/pages/dashboard/patient/biomarkers/BiomarkersPage'));
const ExercisesPage = lazy(() => import('@/pages/exercises/ExercisesPage'));
const HealthAppsPage = lazy(() => import('@/pages/dashboard/patient/health-apps/HealthAppsPage'));
const OpenSimPage = lazy(() => import('@/pages/opensim/OpenSimPage'));

// Receptionist-specific pages
const BillingPage = lazy(() => import('@/pages/dashboard/receptionist/billing/BillingPage'));
const InventoryPage = lazy(() => import('@/pages/dashboard/receptionist/inventory/InventoryPage'));
const CommunicationsPage = lazy(() => import('@/pages/dashboard/receptionist/communications/CommunicationsPage'));
const FormsPage = lazy(() => import('@/pages/dashboard/receptionist/forms/FormsPage'));

// Doctor-specific pages
const MotionAnalysisPage = lazy(() => import('@/pages/dashboard/doctor/motion-analysis'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
        <Route path="/session-expired" element={<SessionExpired />} />
        
        {/* Root redirect based on auth status */}
        <Route path="/" element={<Index />} />
        
        {/* Doctor Routes */}
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
        
        {/* Patient Routes */}
        <Route
          path="/dashboard/patient"
          element={
            <ProtectedRoute requiredRole={UserRole.PATIENT}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Receptionist Routes */}
        <Route
          path="/dashboard/receptionist"
          element={
            <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />
        
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
        
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
        
        {/* Patient-specific pages */}
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
        
        <Route
          path="/opensim"
          element={
            <ProtectedRoute>
              <OpenSimPage />
            </ProtectedRoute>
          }
        />
        
        {/* Receptionist-specific pages */}
        <Route
          path="/billing"
          element={
            <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/inventory"
          element={
            <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/communications"
          element={
            <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
              <CommunicationsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/forms"
          element={
            <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
              <FormsPage />
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
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
