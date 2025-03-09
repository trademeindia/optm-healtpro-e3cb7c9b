
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/PatientDashboard';
import BiomarkersPage from './pages/BiomarkersPage';
import PatientsPage from './pages/PatientsPage';
import ReportsPage from './pages/ReportsPage';
import PatientReportsPage from './pages/PatientReportsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import HealthAppsPage from './pages/HealthAppsPage';
import ExercisePage from './pages/exercises/ExercisePage';
import NotFound from './pages/NotFound';
import OAuthCallback from './pages/OAuthCallback';
import AIReportAnalysisPage from './pages/AIReportAnalysisPage';

// Define the app routes
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/patient-dashboard',
    element: <PatientDashboard />,
  },
  {
    path: '/biomarkers',
    element: <BiomarkersPage />,
  },
  {
    path: '/ai-report-analysis',
    element: <AIReportAnalysisPage />,
  },
  {
    path: '/patients',
    element: <PatientsPage />,
  },
  {
    path: '/reports',
    element: <ReportsPage />,
  },
  {
    path: '/patient-reports',
    element: <PatientReportsPage />,
  },
  {
    path: '/appointments',
    element: <AppointmentsPage />,
  },
  {
    path: '/health-apps',
    element: <HealthAppsPage />,
  },
  {
    path: '/exercises',
    element: <ExercisePage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/help',
    element: <HelpPage />,
  },
  {
    path: '/oauth-callback',
    element: <OAuthCallback />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
