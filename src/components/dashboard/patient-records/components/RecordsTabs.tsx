
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FilePlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface RecordsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  recordsCount: number;
  reportsCount: number;
}

const RecordsTabs: React.FC<RecordsTabsProps> = ({
  activeTab,
  setActiveTab,
  recordsCount,
  reportsCount
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="records" className="flex items-center justify-center gap-2">
          <FileText className="h-4 w-4" />
          Records
          <Badge variant="secondary" className="ml-1">{recordsCount}</Badge>
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center justify-center gap-2">
          <FilePlus className="h-4 w-4" />
          Reports
          <Badge variant="secondary" className="ml-1">{reportsCount}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default RecordsTabs;
