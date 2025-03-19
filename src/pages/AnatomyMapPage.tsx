
import React, { useEffect } from 'react';
import AnatomyMapContainer from '@/components/anatomy-map/AnatomyMapContainer';
import { Toaster } from 'sonner';
import { SymptomProvider } from '@/contexts/SymptomContext';
import Sidebar from '@/components/layout/Sidebar';

const AnatomyMapPage: React.FC = () => {
  // Add effect to prevent excessive re-renders
  useEffect(() => {
    // Prevent page refresh on form submissions
    const handleSubmit = (e: SubmitEvent) => {
      if (e.target instanceof HTMLFormElement) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('submit', handleSubmit);
    return () => document.removeEventListener('submit', handleSubmit);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Anatomy Map</h1>
              <p className="text-muted-foreground">
                Use this interactive map to track and update your pain symptoms. Select areas where you experience
                discomfort and provide details to help your healthcare provider understand your condition better.
              </p>
            </div>
            
            <SymptomProvider>
              <AnatomyMapContainer />
              <Toaster position="bottom-right" />
            </SymptomProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnatomyMapPage;
