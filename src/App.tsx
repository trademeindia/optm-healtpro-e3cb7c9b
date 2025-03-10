
import React from 'react';
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
import PatientReportsPage from './pages/PatientReportsPage';
import OAuthCallback from './pages/OAuthCallback';
import HealthAppsPage from './pages/HealthAppsPage';
import AIAnalysisPage from './pages/AIAnalysisPage';
import { AuthProvider } from './contexts/auth';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
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
          </Router>
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
