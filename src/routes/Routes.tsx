
import React, { Suspense, useState, useEffect } from 'react';
import { Routes as RouterRoutes } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { AuthRoutes } from './auth/AuthRoutes';
import { DoctorRoutes } from './dashboard/DoctorRoutes';
import { PatientRoutes } from './dashboard/PatientRoutes';
import { ReceptionistRoutes } from './dashboard/ReceptionistRoutes';
import { CommonRoutes } from './common/CommonRoutes';
import { toast } from 'sonner';
import { logRoutingState } from '@/utils/debugUtils';
import ErrorBoundary from '@/components/ErrorBoundary';

const AppRoutes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Log routing state for debugging
    logRoutingState('AppRoutes', { initialized: true });
    
    // Simulate loading to ensure everything is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
        <RouterRoutes>
          {/* Auth Routes */}
          <AuthRoutes />
          
          {/* Doctor Routes */}
          <DoctorRoutes />
          
          {/* Patient Routes */}
          <PatientRoutes />
          
          {/* Receptionist Routes */}
          <ReceptionistRoutes />
          
          {/* Common Routes */}
          <CommonRoutes />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
