
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import AnatomyMapContainer from '@/components/anatomy-map/AnatomyMapContainer';
import { Toaster } from 'sonner';

const AnatomyMapPage: React.FC = () => {
  return (
    <Layout>
      <div className="container p-4 mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Anatomy Map</h1>
        <p className="text-muted-foreground mb-6">
          Use this interactive map to track and update your pain symptoms. Select areas where you experience
          discomfort and provide details to help your healthcare provider understand your condition better.
        </p>
        
        <AnatomyMapContainer />
        <Toaster position="bottom-right" />
      </div>
    </Layout>
  );
};

export default AnatomyMapPage;
