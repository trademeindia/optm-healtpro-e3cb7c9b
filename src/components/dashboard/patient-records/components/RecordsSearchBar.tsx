
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface RecordsSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  recordType: string;
  onRecordTypeChange: (value: string) => void;
}

const RecordsSearchBar: React.FC<RecordsSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  recordType,
  onRecordTypeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search records..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={recordType} onValueChange={onRecordTypeChange}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filter by type</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="xray">X-Ray/Scans</SelectItem>
            <SelectItem value="bloodTest">Blood Tests</SelectItem>
            <SelectItem value="medication">Medications</SelectItem>
            <SelectItem value="clinicalNote">Clinical Notes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RecordsSearchBar;
