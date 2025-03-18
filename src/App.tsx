
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { ThemeProvider } from 'next-themes';
import './App.css';
import Login from './pages/Login';
import Index from './pages/Index';
import DashboardPage from './pages/dashboard/DashboardPage';
import PatientsPage from './pages/patients/PatientsPage';
import ReportsPage from './pages/ReportsPage';
import BiomarkersPage from './pages/BiomarkersPage';
import ExercisePage from './pages/exercises/ExercisePage';
import AppointmentsPage from './pages/AppointmentsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import NotFound from './pages/NotFound';
import PatientDashboard from './pages/PatientDashboard';
import { PatientReportsPage } from './pages/PatientReportsPage';
import OAuthCallback from './pages/OAuthCallback';
import HealthAppsPage from './pages/HealthAppsPage';
import AIAnalysisPage from './pages/AIAnalysisPage';
import { AuthProvider } from './contexts/auth';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Create a client with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

function App() {
  const handleGlobalError = (error: Error) => {
    console.error('Global error caught by ErrorBoundary:', error);
  };

  return (
    <ErrorBoundary onError={handleGlobalError}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={
                    <ErrorBoundary>
                      <Index />
                    </ErrorBoundary>
                  } />
                  <Route path="/login" element={
                    <ErrorBoundary>
                      <Login />
                    </ErrorBoundary>
                  } />
                  <Route path="/dashboard" element={
                    <ErrorBoundary>
                      <DashboardPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/patients" element={
                    <ErrorBoundary>
                      <PatientsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/reports" element={
                    <ErrorBoundary>
                      <ReportsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/biomarkers" element={
                    <ErrorBoundary>
                      <BiomarkersPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/exercises" element={
                    <ErrorBoundary>
                      <ExercisePage />
                    </ErrorBoundary>
                  } />
                  <Route path="/appointments" element={
                    <ErrorBoundary>
                      <AppointmentsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/settings" element={
                    <ErrorBoundary>
                      <SettingsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/help" element={
                    <ErrorBoundary>
                      <HelpPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/patient-dashboard" element={
                    <ErrorBoundary>
                      <PatientDashboard />
                    </ErrorBoundary>
                  } />
                  <Route path="/patient-reports" element={
                    <ErrorBoundary>
                      <PatientReportsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/oauth-callback" element={
                    <ErrorBoundary>
                      <OAuthCallback />
                    </ErrorBoundary>
                  } />
                  <Route path="/health-apps" element={
                    <ErrorBoundary>
                      <HealthAppsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/ai-analysis" element={
                    <ErrorBoundary>
                      <AIAnalysisPage />
                    </ErrorBoundary>
                  } />
                  <Route path="*" element={
                    <ErrorBoundary>
                      <NotFound />
                    </ErrorBoundary>
                  } />
                </Routes>
                <Toaster position="bottom-right" richColors closeButton />
              </Suspense>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
