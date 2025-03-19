
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface RecordsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  onAddRecord: (type: string) => void;
}

const RecordsTabs: React.FC<RecordsTabsProps> = ({ activeTab, setActiveTab, onAddRecord }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <TabsList>
        <TabsTrigger value="all">All Documents</TabsTrigger>
        <TabsTrigger value="records">Medical Records</TabsTrigger>
        <TabsTrigger value="reports">Lab Reports</TabsTrigger>
      </TabsList>
      
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="mr-1 h-4 w-4" />
              Add Record
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAddRecord('xray')}>
              X-Ray or Scan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddRecord('bloodTest')}>
              Blood Test
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddRecord('medication')}>
              Medication
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddRecord('clinicalNote')}>
              Clinical Note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default RecordsTabs;
