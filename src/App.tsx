
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { ThemeProvider } from 'next-themes';
import './App.css';

// Import the non-lazy loaded components
import Login from './pages/Login';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/auth';

// Lazy load the other pages to improve initial load time
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const PatientsPage = lazy(() => import('./pages/patients/PatientsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const BiomarkersPage = lazy(() => import('./pages/BiomarkersPage'));
const ExercisePage = lazy(() => import('./pages/exercises/ExercisePage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
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

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: () => void }) => (
  <div className="flex h-screen w-full items-center justify-center bg-background z-50 fixed inset-0">
    <div className="text-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg border border-destructive/20 max-w-md">
      <div className="w-20 h-20 mx-auto mb-6 text-destructive">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Application Error</h2>
      <p className="text-muted-foreground mb-6">{error?.message || 'Something went wrong'}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/biomarkers" element={<BiomarkersPage />} />
                    <Route path="/exercises" element={<ExercisePage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/patient-dashboard" element={<PatientDashboard />} />
                    <Route path="/patient-reports" element={<PatientReportsPage />} />
                    <Route path="/oauth-callback" element={<OAuthCallback />} />
                    <Route path="/health-apps" element={<HealthAppsPage />} />
                    <Route path="/ai-analysis" element={<AIAnalysisPage />} />
                    <Route path="/anatomy-map" element={<AnatomyMapPage />} />
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
