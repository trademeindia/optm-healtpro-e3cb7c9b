
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DocumentSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search documents..."
        className="pl-8 text-sm"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default DocumentSearch;
