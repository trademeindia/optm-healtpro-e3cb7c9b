
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PainSymptom, BodyRegion } from '@/components/anatomy-map/types';

interface SymptomSyncContextType {
  recentlyViewedRegions: BodyRegion[];
  recentlyUpdatedSymptoms: PainSymptom[];
  trackRegionView: (region: BodyRegion) => void;
  trackSymptomUpdate: (symptom: PainSymptom) => void;
  clearRecentViews: () => void;
}

const SymptomSyncContext = createContext<SymptomSyncContextType | undefined>(undefined);

export const SymptomSyncProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [recentlyViewedRegions, setRecentlyViewedRegions] = useState<BodyRegion[]>([]);
  const [recentlyUpdatedSymptoms, setRecentlyUpdatedSymptoms] = useState<PainSymptom[]>([]);

  // Track when a region is viewed
  const trackRegionView = useCallback((region: BodyRegion) => {
    setRecentlyViewedRegions(prev => {
      // Check if region is already in the list
      const exists = prev.some(r => r.id === region.id);
      if (exists) {
        // Move it to the top if it exists
        return [region, ...prev.filter(r => r.id !== region.id)];
      }
      // Add it to the top, limiting to 5 recent views
      return [region, ...prev].slice(0, 5);
    });
    
    // In a real app, this would sync with a backend service
    console.log(`Tracking region view: ${region.name}`);
  }, []);

  // Track when a symptom is updated
  const trackSymptomUpdate = useCallback((symptom: PainSymptom) => {
    setRecentlyUpdatedSymptoms(prev => {
      // Check if symptom is already in the list
      const exists = prev.some(s => s.id === symptom.id);
      if (exists) {
        // Replace it if it exists
        return [symptom, ...prev.filter(s => s.id !== symptom.id)];
      }
      // Add it to the top, limiting to 5 recent updates
      return [symptom, ...prev].slice(0, 5);
    });
    
    // In a real app, this would sync with a backend service
    console.log(`Symptom updated: ${symptom.id} in region ${symptom.bodyRegionId}`);
  }, []);

  // Clear recent views (for testing)
  const clearRecentViews = useCallback(() => {
    setRecentlyViewedRegions([]);
  }, []);

  // In a real app, we would set up a real-time listener here
  useEffect(() => {
    // Mock real-time updates for demonstration
    const interval = setInterval(() => {
      if (recentlyUpdatedSymptoms.length > 0) {
        console.log('Syncing recent symptom updates with dashboards...');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [recentlyUpdatedSymptoms]);

  return (
    <SymptomSyncContext.Provider value={{
      recentlyViewedRegions,
      recentlyUpdatedSymptoms,
      trackRegionView,
      trackSymptomUpdate,
      clearRecentViews
    }}>
      {children}
    </SymptomSyncContext.Provider>
  );
};

export const useSymptomSync = () => {
  const context = useContext(SymptomSyncContext);
  if (context === undefined) {
    throw new Error('useSymptomSync must be used within a SymptomSyncProvider');
  }
  return context;
};
