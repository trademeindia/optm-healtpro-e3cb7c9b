
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AnatomyMapContainer from '@/components/anatomy-map/AnatomyMapContainer';
import { Toaster } from 'sonner';

const AnatomyMapPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold mb-4">Anatomy Map</h1>
            <p className="text-muted-foreground mb-6">
              Use this interactive map to track and update your pain symptoms. Select areas where you experience
              discomfort and provide details to help your healthcare provider understand your condition better.
            </p>
            
            <AnatomyMapContainer />
          </div>
          <Toaster position="bottom-right" />
        </main>
      </div>
    </div>
  );
};

export default AnatomyMapPage;
