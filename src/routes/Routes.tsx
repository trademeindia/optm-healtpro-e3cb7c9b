
import React, { lazy, Suspense } from 'react';
import { Routes as RouterRoutes } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { DoctorRouter } from './dashboard/DoctorRouter';
import { PatientRouter } from './dashboard/PatientRouter';
import { ReceptionistRouter } from './dashboard/ReceptionistRouter';
import { AuthRouter } from './auth/AuthRouter';

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterRoutes>
        <AuthRouter />
        <DoctorRouter />
        <PatientRouter />
        <ReceptionistRouter />
      </RouterRoutes>
    </Suspense>
  );
};

export default AppRoutes;
