
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';
import ReceptionistDashboard from '@/pages/dashboard/receptionist/ReceptionistDashboard';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const ReceptionistRoutes = () => {
  return (
    <>
      <Route
        path="/dashboard/receptionist"
        element={
          <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
            <ReceptionistDashboard />
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
    </>
  );
};
