
import React from 'react';
import { Button } from '@/components/ui/button';
import { PatientTablePaginationProps } from '../types';

export const PatientTablePagination: React.FC<PatientTablePaginationProps> = ({ 
  filteredCount, 
  totalCount 
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} patients
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </div>
  );
};
