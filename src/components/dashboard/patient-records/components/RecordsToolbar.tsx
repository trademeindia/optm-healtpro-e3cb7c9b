
import React from 'react';
import { Button } from '@/components/ui/button';
import RecordsSearchBar from './RecordsSearchBar';
import { useAuth } from '@/contexts/auth';

interface RecordsToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAddButtonClick: (type: 'record' | 'report') => void;
}

const RecordsToolbar: React.FC<RecordsToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  onAddButtonClick
}) => {
  const { user } = useAuth();
  const canAddRecords = user?.role === 'doctor' || user?.role === 'admin';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <RecordsSearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      {canAddRecords && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onAddButtonClick('record')}>
            Add Record
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAddButtonClick('report')}>
            Add Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecordsToolbar;
