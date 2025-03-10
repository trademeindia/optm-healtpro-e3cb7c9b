
import { useState } from 'react';

/**
 * Hook to manage filter and sort state
 */
export const useFilterSortState = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  return {
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy
  };
};
