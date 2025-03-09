
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TabHeaderProps {
  title: string;
  description: string;
  onAddRecord: () => void;
  buttonLabel?: string;
}

const TabHeader: React.FC<TabHeaderProps> = ({ 
  title, 
  description, 
  onAddRecord, 
  buttonLabel = "Add Record" 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search records..." className="pl-9 h-9 w-[200px]" />
        </div>
        <Button className="gap-1" onClick={onAddRecord}>
          <Plus className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default TabHeader;
