
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BiomarkerSearchProps } from './types';

const BiomarkerSearch: React.FC<BiomarkerSearchProps> = ({ 
  searchTerm, 
  setSearchTerm,
  onAddBiomarker 
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 md:w-60">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search biomarkers..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Button onClick={onAddBiomarker} className="whitespace-nowrap">
        <span className="mr-1">+</span> Add Biomarker
      </Button>
    </div>
  );
};

export default BiomarkerSearch;
