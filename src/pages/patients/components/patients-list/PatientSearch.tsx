
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PatientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
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
    </div>
  );
};
