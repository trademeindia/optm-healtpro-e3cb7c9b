
import { useMemo } from 'react';
import { Biomarker } from '@/components/dashboard/biomarker-display/types';

/**
 * Hook to calculate biomarker statistics
 */
export const useBiomarkerStats = (biomarkers: Biomarker[]) => {
  // Calculate counts for the biomarker stats
  const totalBiomarkers = biomarkers.length;
  const normalCount = biomarkers.filter(b => b.status === 'normal').length;
  const elevatedCount = biomarkers.filter(b => b.status === 'elevated').length;
  const lowCount = biomarkers.filter(b => b.status === 'low').length;
  const criticalCount = biomarkers.filter(b => b.status === 'critical').length;
  
  // Calculate the latest update timestamp
  const latestUpdate = useMemo(() => {
    if (biomarkers.length === 0) return 'No data';
    
    return new Date(Math.max(...biomarkers.map(b => new Date(b.timestamp).getTime())))
      .toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
  }, [biomarkers]);

  return {
    totalBiomarkers,
    normalCount,
    elevatedCount,
    lowCount,
    criticalCount,
    latestUpdate
  };
};
