
import { Biomarker } from '@/components/dashboard/biomarker-display/types';

/**
 * Filter biomarkers based on selected status
 */
export const filterBiomarkersByStatus = (
  biomarkers: Biomarker[],
  filterStatus: string
): Biomarker[] => {
  return biomarkers.filter(biomarker => {
    if (filterStatus === 'all') return true;
    return biomarker.status === filterStatus;
  });
};

/**
 * Sort biomarkers based on selected sort criteria
 */
export const sortBiomarkers = (
  biomarkers: Biomarker[],
  sortBy: string
): Biomarker[] => {
  return [...biomarkers].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'status') {
      // Sort by severity (critical > elevated > low > normal)
      const statusOrder = { critical: 3, elevated: 2, low: 1, normal: 0 };
      return statusOrder[b.status] - statusOrder[a.status];
    }
    return 0;
  });
};
