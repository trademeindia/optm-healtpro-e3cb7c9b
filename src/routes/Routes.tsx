import React, { Suspense, useState, useEffect } from 'react';
import { Routes as RouterRoutes, Route, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { toast } from 'sonner';
import { logRoutingState } from '@/utils/debugUtils';
import ErrorBoundary from '@/components/ErrorBoundary';
import { motion } from 'framer-motion';

// Import actual components instead of route definitions
import LoginPage from '@/pages/LoginPage';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import SessionExpired from '@/components/SessionExpired';
import Index from '@/pages/Index';
import DoctorDashboard from '@/pages/dashboard/DoctorDashboard';
import PatientDashboard from '@/pages/dashboard/patient/PatientDashboard';
import ReceptionistDashboard from '@/pages/dashboard/receptionist/ReceptionistDashboard';
import MotionAnalysisPage from '@/pages/dashboard/doctor/motion-analysis';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  }
};

// Animation transition configuration
const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

// Animated route wrapper component
const AnimatedRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="page-wrapper"
    >
      {children}
    </motion.div>
  );
};

const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Log routing state for debugging
    logRoutingState('AppRoutes', { initialized: true, path: location.pathname });
    
    // Simulate loading to ensure everything is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Handle suspense error via ErrorBoundary instead of directly on Suspense
  const handleSuspenseError = (error: Error) => {
    console.error("Error loading route:", error);
    toast.error("Failed to load page", {
      description: "There was a problem loading this page. Please try again."
    });
  };
  
  return (
    <ErrorBoundary onError={handleSuspenseError}>
      <Suspense fallback={<LoadingScreen />}>
        <RouterRoutes location={location}>
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <AnimatedRouteWrapper>
                <LoginPage />
              </AnimatedRouteWrapper>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AnimatedRouteWrapper>
                <PlaceholderPage title="Signup Page" />
              </AnimatedRouteWrapper>
            } 
          />
          <Route 
            path="/password-reset" 
            element={
              <AnimatedRouteWrapper>
                <PlaceholderPage title="Password Reset Page" />
              </AnimatedRouteWrapper>
            } 
          />
          <Route 
            path="/password-recovery" 
            element={
              <AnimatedRouteWrapper>
                <PlaceholderPage title="Password Recovery Page" />
              </AnimatedRouteWrapper>
            } 
          />
          <Route 
            path="/session-expired" 
            element={
              <AnimatedRouteWrapper>
                <SessionExpired />
              </AnimatedRouteWrapper>
            } 
          />
          <Route 
            path="/" 
            element={
              <AnimatedRouteWrapper>
                <Index />
              </AnimatedRouteWrapper>
            } 
          />
          
          {/* Doctor Routes */}
          <Route
            path="/dashboard/doctor"
            element={
              <ProtectedRoute requiredRole={UserRole.DOCTOR}>
                <AnimatedRouteWrapper>
                  <DoctorDashboard />
                </AnimatedRouteWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/doctor/motion-analysis"
            element={
              <ProtectedRoute requiredRole={UserRole.DOCTOR}>
                <AnimatedRouteWrapper>
                  <MotionAnalysisPage />
                </AnimatedRouteWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRole={UserRole.DOCTOR}>
                <PlaceholderPage title="Reports Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requiredRole={UserRole.DOCTOR}>
                <PlaceholderPage title="Analytics Page" />
              </ProtectedRoute>
            }
          />
          
          {/* Patient Routes */}
          <Route
            path="/dashboard/patient"
            element={
              <ProtectedRoute requiredRole={UserRole.PATIENT}>
                <AnimatedRouteWrapper>
                  <PatientDashboard />
                </AnimatedRouteWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ai-analysis"
            element={
              <ProtectedRoute requiredRole={UserRole.PATIENT}>
                <PlaceholderPage title="AI Analysis Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/anatomy-map"
            element={
              <ProtectedRoute requiredRole={UserRole.PATIENT}>
                <PlaceholderPage title="Anatomy Map Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/biomarkers"
            element={
              <ProtectedRoute requiredRole={UserRole.PATIENT}>
                <PlaceholderPage title="Biomarkers Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/exercises"
            element={
              <ProtectedRoute requiredRole={UserRole.PATIENT}>
                <PlaceholderPage title="Exercises Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/health-apps"
            element={
              <ProtectedRoute requiredRole={UserRole.PATIENT}>
                <PlaceholderPage title="Health Apps Page" />
              </ProtectedRoute>
            }
          />
          
          {/* Receptionist Routes */}
          <Route
            path="/dashboard/receptionist"
            element={
              <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
                <AnimatedRouteWrapper>
                  <ReceptionistDashboard />
                </AnimatedRouteWrapper>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/billing"
            element={
              <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
                <PlaceholderPage title="Billing Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/inventory"
            element={
              <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
                <PlaceholderPage title="Inventory Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/communications"
            element={
              <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
                <PlaceholderPage title="Communications Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/forms"
            element={
              <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
                <PlaceholderPage title="Forms Page" />
              </ProtectedRoute>
            }
          />
          
          {/* Common Routes */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute requiredRole={[UserRole.DOCTOR, UserRole.RECEPTIONIST]}>
                <PlaceholderPage title="Patients List Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute requiredRole={[UserRole.DOCTOR, UserRole.RECEPTIONIST]}>
                <PlaceholderPage title="Patient Details Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Appointments Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/opensim"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="OpenSim Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Settings Page" />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <PlaceholderPage title="Help Page" />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Not Found */}
          <Route 
            path="*" 
            element={
              <AnimatedRouteWrapper>
                <PlaceholderPage title="Not Found Page" />
              </AnimatedRouteWrapper>
            } 
          />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
