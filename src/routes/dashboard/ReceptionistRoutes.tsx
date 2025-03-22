
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/auth/types';

// Lazy-loaded receptionist components
const ReceptionistDashboard = lazy(() => import('@/pages/dashboard/receptionist/ReceptionistDashboard'));
const BillingPage = lazy(() => import('@/pages/dashboard/receptionist/billing/BillingPage'));
const InventoryPage = lazy(() => import('@/pages/dashboard/receptionist/inventory/InventoryPage'));
const CommunicationsPage = lazy(() => import('@/pages/dashboard/receptionist/communications/CommunicationsPage'));
const FormsPage = lazy(() => import('@/pages/dashboard/receptionist/forms/FormsPage'));

export const ReceptionistRoutes: React.FC = () => {
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
            <BillingPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/inventory"
        element={
          <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/communications"
        element={
          <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
            <CommunicationsPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/forms"
        element={
          <ProtectedRoute requiredRole={UserRole.RECEPTIONIST}>
            <FormsPage />
          </ProtectedRoute>
        }
      />
    </>
  );
};
