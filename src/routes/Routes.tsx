
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';

// Lazy-loaded components for better performance
const ExercisePage = React.lazy(() => import('@/pages/exercises/ExercisePage'));

// Loading fallback
const PageLoading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      <Route path="/exercises" element={
        <Suspense fallback={<PageLoading />}>
          <ExercisePage />
        </Suspense>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
