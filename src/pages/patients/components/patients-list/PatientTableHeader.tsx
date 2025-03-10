
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface PatientTableHeaderProps {
  sortBy?: 'name' | 'lastVisit' | 'condition';
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: 'name' | 'lastVisit' | 'condition') => void;
}

export const PatientTableHeader: React.FC<PatientTableHeaderProps> = ({
  sortBy,
  sortDirection,
  onSort
}) => {
  const handleSort = (column: 'name' | 'lastVisit' | 'condition') => {
    if (onSort) {
      onSort(column);
    }
  };

  return (
    <thead>
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
          <div 
            className="flex items-center gap-1 cursor-pointer" 
            onClick={() => handleSort('name')}
          >
            Patient
            <ArrowUpDown className="h-3 w-3" />
          </div>
        </th>
        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleSort('condition')}
          >
            Diagnosis
            <ArrowUpDown className="h-3 w-3" />
          </div>
        </th>
        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ICD Code</th>
        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleSort('lastVisit')}
          >
            Last Visit
            <ArrowUpDown className="h-3 w-3" />
          </div>
        </th>
        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Next Appointment</th>
        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
      </tr>
    </thead>
  );
};
