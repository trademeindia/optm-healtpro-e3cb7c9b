
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { ThemeProvider } from 'next-themes';
import { Spinner } from './components/ui/spinner';
import './App.css';

// Import pages with better error boundaries
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

// Create a client with safer defaults and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error boundary component to catch render errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="p-6 max-w-md mx-auto bg-card rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-destructive mb-4">Application Error</h2>
            <p className="mb-4 text-muted-foreground">
              Something went wrong while loading the application.
            </p>
            <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-40 mb-4">
              {this.state.error?.message || "Unknown error"}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback for suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen w-full bg-background">
    <div className="flex flex-col items-center space-y-4">
      <Spinner size="lg" />
      <div className="text-foreground p-4 text-center">
        <h2 className="text-xl font-medium">Loading Application...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we prepare your experience</p>
      </div>
    </div>
  </div>
);

function App() {
  console.log('App component rendering');
  
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingFallback />}>
            <Router>
              <AuthProvider>
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster position="bottom-right" richColors closeButton />
              </AuthProvider>
            </Router>
          </Suspense>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
