
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export interface RecordsSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const RecordsSearchBar: React.FC<RecordsSearchBarProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search records..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default RecordsSearchBar;
