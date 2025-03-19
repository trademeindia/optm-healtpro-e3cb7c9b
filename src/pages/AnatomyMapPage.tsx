
import React from 'react';
import AnatomyMapContainer from '@/components/anatomy-map/AnatomyMapContainer';
import { Toaster } from 'sonner';

// Create a simple layout component since the imported one isn't available
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

const AnatomyMapPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="container p-4 mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Anatomy Map</h1>
        <p className="text-muted-foreground mb-6">
          Use this interactive map to track and update your pain symptoms. Select areas where you experience
          discomfort and provide details to help your healthcare provider understand your condition better.
        </p>
        
        <AnatomyMapContainer />
        <Toaster position="bottom-right" />
      </div>
    </PageLayout>
  );
};

export default AnatomyMapPage;
