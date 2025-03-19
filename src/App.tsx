
import React, { Suspense, lazy } from 'react';
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

// Loading fallback component
const PageLoading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-16 h-16 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="app-container min-h-screen bg-background text-foreground">
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
              <Toaster position="bottom-right" richColors closeButton />
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
