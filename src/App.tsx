
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import BiomarkersPage from "./pages/BiomarkersPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ReportsPage from "./pages/ReportsPage";
import PatientsPage from "./pages/PatientsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
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
  
  // Check if user has the required role
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'doctor' ? '/dashboard' : '/patient-dashboard'} />;
  }
  
  return <>{children}</>;
};

// AppRoutes component to use AuthContext
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
      
      {/* Doctor routes */}
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
      <Route path="/biomarkers" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <BiomarkersPage />
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
      
      {/* Patient routes */}
      <Route path="/patient-dashboard" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      
      {/* Shared routes */}
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
