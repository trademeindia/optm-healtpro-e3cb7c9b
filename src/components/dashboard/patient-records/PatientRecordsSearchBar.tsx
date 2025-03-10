
import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PatientRecordsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddPatient: () => void;
}

export const PatientRecordsSearchBar: React.FC<PatientRecordsSearchBarProps> = ({ 
  searchTerm, 
  onSearchChange,
  onAddPatient 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold">Patient Records</h2>
        <p className="text-sm text-muted-foreground">
          View and manage all patient information
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search patients..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        
        <Button onClick={onAddPatient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>
    </div>
  );
};
