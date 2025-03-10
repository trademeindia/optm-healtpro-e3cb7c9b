
import { useMemo } from 'react';
import { Biomarker } from '@/components/dashboard/biomarker-display/types';
import { useFilterSortState } from './hooks/useFilterSortState';
import { useBiomarkerStats } from './hooks/useBiomarkerStats';
import { filterBiomarkersByStatus, sortBiomarkers } from './utils/biomarkerFilterUtils';

export const useBiomarkerData = (biomarkers: Biomarker[]) => {
  // Get filter and sort state
  const { filterStatus, setFilterStatus, sortBy, setSortBy } = useFilterSortState();
  
  // Get biomarker statistics
  const { 
    totalBiomarkers, 
    normalCount, 
    elevatedCount, 
    lowCount, 
    criticalCount, 
    latestUpdate 
  } = useBiomarkerStats(biomarkers);

  // Filter biomarkers based on selected status
  const filteredBiomarkers = useMemo(() => {
    return filterBiomarkersByStatus(biomarkers, filterStatus);
  }, [biomarkers, filterStatus]);

  // Sort biomarkers based on selected sort criteria
  const sortedBiomarkers = useMemo(() => {
    return sortBiomarkers(filteredBiomarkers, sortBy);
  }, [filteredBiomarkers, sortBy]);

  return {
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    totalBiomarkers,
    normalCount,
    elevatedCount,
    lowCount,
    criticalCount,
    latestUpdate,
    sortedBiomarkers
  };
};
