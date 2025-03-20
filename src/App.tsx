
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { ThemeProvider } from 'next-themes';
import './App.css';

// Import the non-lazy loaded components
import LoginPage from './pages/LoginPage';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy load the other pages to improve initial load time
const DoctorDashboard = lazy(() => import('./pages/dashboard/DoctorDashboard'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const ReceptionistDashboard = lazy(() => import('./pages/dashboard/ReceptionistDashboard'));
const PatientsPage = lazy(() => import('./pages/patients/PatientsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const BiomarkersPage = lazy(() => import('./pages/BiomarkersPage'));
const ExercisePage = lazy(() => import('./pages/exercises/ExercisePage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const PatientReportsPage = lazy(() => import('./pages/PatientReportsPage'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const HealthAppsPage = lazy(() => import('./pages/HealthAppsPage'));
const AIAnalysisPage = lazy(() => import('./pages/AIAnalysisPage'));
const AnatomyMapPage = lazy(() => import('./pages/AnatomyMapPage'));

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component with improved visibility
const PageLoading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background z-50 fixed inset-0">
    <div className="text-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full">
      <div className="w-20 h-20 border-t-4 border-b-4 border-primary rounded-full animate-spin mx-auto mb-6"></div>
      <p className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Loading page...</p>
      <p className="text-sm text-muted-foreground">Please wait while we prepare your content</p>
    </div>
  </div>
);

function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  // Ensure app loads quickly
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoaded(true);
      console.log('App loaded state set to true');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="app-container min-h-screen bg-background text-foreground visible opacity-100">
              {!appLoaded ? (
                <div className="global-loading-spinner z-[9999] fixed inset-0 flex items-center justify-center bg-white/90">
                  <div className="text-center">
                    <div className="w-20 h-20 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium">Loading application...</p>
                  </div>
                </div>
              ) : (
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/oauth-callback" element={<OAuthCallback />} />
                    
                    {/* Doctor routes */}
                    <Route path="/dashboard/doctor" element={
                      <ProtectedRoute requiredRole="doctor">
                        <DoctorDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/patients" element={
                      <ProtectedRoute requiredRole="doctor">
                        <PatientsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute requiredRole="doctor">
                        <ReportsPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Patient routes */}
                    <Route path="/dashboard/patient" element={
                      <ProtectedRoute requiredRole="patient">
                        <PatientDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/patient-reports" element={
                      <ProtectedRoute requiredRole="patient">
                        <PatientReportsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/health-apps" element={
                      <ProtectedRoute requiredRole="patient">
                        <HealthAppsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/ai-analysis" element={
                      <ProtectedRoute requiredRole="patient">
                        <AIAnalysisPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/anatomy-map" element={
                      <ProtectedRoute requiredRole="patient">
                        <AnatomyMapPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/exercises" element={
                      <ProtectedRoute requiredRole="patient">
                        <ExercisePage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Receptionist routes */}
                    <Route path="/dashboard/receptionist" element={
                      <ProtectedRoute requiredRole="receptionist">
                        <ReceptionistDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/appointments" element={
                      <ProtectedRoute requiredRole="receptionist" resourceType="APPOINTMENTS" action="VIEW_ALL">
                        <AppointmentsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/biomarkers" element={
                      <ProtectedRoute>
                        <BiomarkersPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Shared routes */}
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/help" element={
                      <ProtectedRoute>
                        <HelpPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Legacy routes - redirect to new structured routes */}
                    <Route path="/dashboard" element={<Navigate to="/dashboard/doctor" replace />} />
                    <Route path="/patient-dashboard" element={<Navigate to="/dashboard/patient" replace />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              )}
              <Toaster position="bottom-right" richColors closeButton />
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
