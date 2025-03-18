import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from "sonner";
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
import { AlertCircle } from 'lucide-react';

// Create a client with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        },
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

// Improved error boundary fallback component
const RouteErrorFallback = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
      <AlertCircle className="h-8 w-8 text-destructive" />
    </div>
    <h2 className="text-xl font-semibold mb-2">Failed to load {name}</h2>
    <p className="mb-6 text-muted-foreground">There was a problem loading this page</p>
    <div className="flex gap-4">
      <button
        className="px-4 py-2 border rounded-md"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  </div>
);

function App() {
  const [appReady, setAppReady] = useState(false);
  
  // Simulate app initialization
  useEffect(() => {
    // Add a small delay to ensure all resources are loaded
    const timer = setTimeout(() => {
      setAppReady(true);
      console.log('App initialized and ready');
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGlobalError = (error: Error) => {
    console.error('Global error caught by ErrorBoundary:', error);
    toast.error('Application Error', {
      description: error.message || 'An unexpected error occurred',
    });
  };

  if (!appReady) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary onError={handleGlobalError}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Home" />}>
                      <Index />
                    </ErrorBoundary>
                  } />
                  <Route path="/login" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Login" />}>
                      <Login />
                    </ErrorBoundary>
                  } />
                  <Route path="/dashboard" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Dashboard" />}>
                      <DashboardPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/patients" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Patients" />}>
                      <PatientsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/reports" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Reports" />}>
                      <ReportsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/biomarkers" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Biomarkers" />}>
                      <BiomarkersPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/exercises" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Exercises" />}>
                      <ExercisePage />
                    </ErrorBoundary>
                  } />
                  <Route path="/appointments" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Appointments" />}>
                      <AppointmentsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/settings" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Settings" />}>
                      <SettingsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/help" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Help" />}>
                      <HelpPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/patient-dashboard" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Patient Dashboard" />}>
                      <PatientDashboard />
                    </ErrorBoundary>
                  } />
                  <Route path="/patient-reports" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Patient Reports" />}>
                      <PatientReportsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/oauth-callback" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="OAuth Callback" />}>
                      <OAuthCallback />
                    </ErrorBoundary>
                  } />
                  <Route path="/health-apps" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="Health Apps" />}>
                      <HealthAppsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/ai-analysis" element={
                    <ErrorBoundary fallback={<RouteErrorFallback name="AI Analysis" />}>
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
