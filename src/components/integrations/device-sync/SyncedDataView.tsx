
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import CurrentDataTab from './tabs/CurrentDataTab';
import HistoricalDataTab from './tabs/HistoricalDataTab';

interface SyncedDataViewProps {
  providerName: string;
  lastSyncTime?: string;
  healthData: FitnessData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  onSync: () => Promise<void>;
}

const SyncedDataView: React.FC<SyncedDataViewProps> = ({
  providerName,
  lastSyncTime,
  healthData,
  activeTab,
  setActiveTab,
  isLoading,
  onSync
}) => {
  return (
    <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="current">Current Data</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
        </TabsList>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSync}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Now</span>
        </Button>
      </div>
      
      <TabsContent value="current" className="space-y-4 mt-2">
        <CurrentDataTab 
          healthData={healthData} 
          providerName={providerName}
          lastSyncTime={lastSyncTime}
        />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4 mt-2">
        <HistoricalDataTab providerName={providerName} />
      </TabsContent>
    </Tabs>
  );
};

export default SyncedDataView;
