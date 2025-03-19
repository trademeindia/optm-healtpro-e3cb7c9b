
import React from 'react';
import AnatomyMapContainer from '@/components/anatomy-map/AnatomyMapContainer';
import { Toaster } from 'sonner';
import { SymptomProvider } from '@/contexts/SymptomContext';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { useSidebarResponsive } from '@/components/layout/sidebar/useSidebarResponsive';

const AnatomyMapPage: React.FC = () => {
  const { isOpen, isMobile, toggleSidebar } = useSidebarResponsive();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Include the sidebar for navigation */}
      <Sidebar />
      
      {/* Main content */}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300",
        isOpen ? "lg:ml-64" : "ml-0"
      )}>
        <div className="container p-4 mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3 text-center md:text-left">Anatomy Map</h1>
            <p className="text-muted-foreground text-center md:text-left max-w-3xl">
              Use this interactive map to track and update your pain symptoms. Select areas where you experience
              discomfort and provide details to help your healthcare provider understand your condition better.
            </p>
          </div>
          
          <SymptomProvider>
            <AnatomyMapContainer />
            <Toaster position="bottom-right" />
          </SymptomProvider>
        </div>
      </main>
    </div>
  );
};

export default AnatomyMapPage;
