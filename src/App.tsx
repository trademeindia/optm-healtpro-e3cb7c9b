import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { useAuth } from './contexts/auth';
import Loading from './components/Loading';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UpdateProfile from './pages/UpdateProfile';
import PatientDashboard from './pages/PatientDashboard';
import BiomarkersPage from './pages/BiomarkersPage';
import AnatomyMapPage from './pages/AnatomyMapPage';
import ExercisesPage from './pages/ExercisesPage';
import HealthAppsPage from './pages/HealthAppsPage';
import PatientReportsPage from './pages/PatientReportsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AIAnalysisPage from './pages/AIAnalysisPage';
import { AnalysisPage } from './pages/analysis';

function App() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return currentUser ? children : <Navigate to="/login" />;
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
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard/doctor" /> : <Login />} />
          <Route path="/register" element={currentUser ? <Navigate to="/dashboard/doctor" /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
          
          {/* Doctor routes */}
          <Route path="/dashboard/doctor" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><Dashboard /></React.Suspense></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><Patients /></React.Suspense></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><Reports /></React.Suspense></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><Analytics /></React.Suspense></ProtectedRoute>} />
          
          {/* Patient routes */}
          <Route path="/dashboard/patient" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><PatientDashboard /></React.Suspense></ProtectedRoute>} />
           <Route path="/ai-analysis" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><AIAnalysisPage /></React.Suspense></ProtectedRoute>} />
          <Route path="/anatomy-map" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><AnatomyMapPage /></React.Suspense></ProtectedRoute>} />
          <Route path="/biomarkers" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><BiomarkersPage /></React.Suspense></ProtectedRoute>} />
          <Route path="/exercises" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><ExercisesPage /></React.Suspense></ProtectedRoute>} />
          <Route path="/health-apps" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><HealthAppsPage /></React.Suspense></ProtectedRoute>} />
          <Route path="/patient-reports" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><PatientReportsPage /></React.Suspense></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><AppointmentsPage /></React.Suspense></ProtectedRoute>} />

          {/* Receptionist routes - can add specific components later */}
          <Route path="/dashboard/receptionist" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><Dashboard /></React.Suspense></ProtectedRoute>} />

          {/* Common routes */}
          <Route path="/settings" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><Settings /></React.Suspense></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><Help /></React.Suspense></ProtectedRoute>} />

          {/* Redirect to dashboard if logged in, otherwise to login */}
          <Route path="/" element={currentUser ? <Navigate to="/dashboard/doctor" /> : <Navigate to="/login" />} />

          {/* Analysis route */}
          <Route path="/analysis" element={<ProtectedRoute><React.Suspense fallback={<Loading />}><AnalysisPage /></React.Suspense></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
