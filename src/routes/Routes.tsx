
import React, { Suspense } from 'react';
import { Routes as RouterRoutes } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { AuthRoutes } from './auth/AuthRoutes';
import { DoctorRoutes } from './dashboard/DoctorRoutes';
import { PatientRoutes } from './dashboard/PatientRoutes';
import { ReceptionistRoutes } from './dashboard/ReceptionistRoutes';
import { CommonRoutes } from './common/CommonRoutes';

const AppRoutes: React.FC = () => {
  return (
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
  );
};

export default AppRoutes;
