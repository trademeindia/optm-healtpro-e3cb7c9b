
import React, { useState, useEffect, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from './contexts/auth';
import { AnalysisPage } from './pages/analysis';

// Handle loading state
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Lazy loaded components
const Dashboard = React.lazy(() => import('./pages/dashboard/components/Dashboard'));
const BiomarkersPage = React.lazy(() => import('./pages/BiomarkersPage'));
const AnatomyMapPage = React.lazy(() => import('./pages/AnatomyMapPage'));
const AIAnalysisPage = React.lazy(() => import('./pages/AIAnalysisPage'));
const PatientDashboard = React.lazy(() => import('./pages/PatientDashboard'));
const ExercisesPage = React.lazy(() => import('./pages/exercises/ExercisePage'));
const HealthAppsPage = React.lazy(() => import('./pages/HealthAppsPage'));
const PatientReportsPage = React.lazy(() => import('./pages/PatientReportsPage'));
const AppointmentsPage = React.lazy(() => import('./pages/AppointmentsPage'));
const Settings = React.lazy(() => import('./pages/SettingsPage'));
const Help = React.lazy(() => import('./pages/HelpPage'));
const Login = React.lazy(() => import('./pages/LoginPage'));
const Register = React.lazy(() => import('./pages/LoginPage')); // Using LoginPage for Register
const ForgotPassword = React.lazy(() => import('./pages/LoginPage')); // Using Login for ForgotPassword
const UpdateProfile = React.lazy(() => import('./pages/SettingsPage')); // Using Settings for profile updates

function App() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard/doctor" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard/doctor" /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/update-profile" element={<ProtectedRoute><Suspense fallback={<Loading />}><UpdateProfile /></Suspense></ProtectedRoute>} />
        
        {/* Doctor routes */}
        <Route path="/dashboard/doctor" element={<ProtectedRoute><Suspense fallback={<Loading />}><Dashboard /></Suspense></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><Suspense fallback={<Loading />}><Dashboard /></Suspense></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Suspense fallback={<Loading />}><Dashboard /></Suspense></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Suspense fallback={<Loading />}><Dashboard /></Suspense></ProtectedRoute>} />
        
        {/* Patient routes */}
        <Route path="/dashboard/patient" element={<ProtectedRoute><Suspense fallback={<Loading />}><PatientDashboard /></Suspense></ProtectedRoute>} />
        <Route path="/ai-analysis" element={<ProtectedRoute><Suspense fallback={<Loading />}><AIAnalysisPage /></Suspense></ProtectedRoute>} />
        <Route path="/anatomy-map" element={<ProtectedRoute><Suspense fallback={<Loading />}><AnatomyMapPage /></Suspense></ProtectedRoute>} />
        <Route path="/biomarkers" element={<ProtectedRoute><Suspense fallback={<Loading />}><BiomarkersPage /></Suspense></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><Suspense fallback={<Loading />}><ExercisesPage /></Suspense></ProtectedRoute>} />
        <Route path="/health-apps" element={<ProtectedRoute><Suspense fallback={<Loading />}><HealthAppsPage /></Suspense></ProtectedRoute>} />
        <Route path="/patient-reports" element={<ProtectedRoute><Suspense fallback={<Loading />}><PatientReportsPage /></Suspense></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Suspense fallback={<Loading />}><AppointmentsPage /></Suspense></ProtectedRoute>} />

        {/* Receptionist routes - can add specific components later */}
        <Route path="/dashboard/receptionist" element={<ProtectedRoute><Suspense fallback={<Loading />}><Dashboard /></Suspense></ProtectedRoute>} />

        {/* Common routes */}
        <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<Loading />}><Settings /></Suspense></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><Suspense fallback={<Loading />}><Help /></Suspense></ProtectedRoute>} />

        {/* Redirect to dashboard if logged in, otherwise to login */}
        <Route path="/" element={user ? <Navigate to="/dashboard/doctor" /> : <Navigate to="/login" />} />

        {/* Analysis route */}
        <Route path="/analysis" element={<ProtectedRoute><Suspense fallback={<Loading />}><AnalysisPage /></Suspense></ProtectedRoute>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
