import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AppointmentsPage from "./pages/AppointmentsPage";
import ReportsPage from "./pages/ReportsPage";
import PatientsPage from "./pages/PatientsPage";
import BiomarkersPage from "./pages/BiomarkersPage";
import HealthAppsPage from "./pages/HealthAppsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { PatientReportsPage } from "./pages/PatientReportsPage";
import OAuthCallback from "./pages/OAuthCallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles = ['doctor', 'patient'] }: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'doctor' ? '/dashboard' : '/patient-dashboard'} />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        user ? (
          <Navigate to={user.role === 'doctor' ? '/dashboard' : '/patient-dashboard'} />
        ) : (
          <Index />
        )
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/patients" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <PatientsPage />
        </ProtectedRoute>
      } />
      <Route path="/appointments" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <AppointmentsPage />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/patient-dashboard" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/biomarkers" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <BiomarkersPage />
        </ProtectedRoute>
      } />
      <Route path="/patient-reports" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientReportsPage />
        </ProtectedRoute>
      } />
      <Route path="/health-apps" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <HealthAppsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          {user?.role === 'doctor' ? <Dashboard /> : <PatientDashboard />}
        </ProtectedRoute>
      } />
      <Route path="/help" element={
        <ProtectedRoute>
          {user?.role === 'doctor' ? <Dashboard /> : <PatientDashboard />}
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
