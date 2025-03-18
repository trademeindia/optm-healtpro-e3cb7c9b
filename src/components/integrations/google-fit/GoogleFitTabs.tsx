
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import CurrentDataTab from './CurrentDataTab';
import HistoricalDataTab from './HistoricalDataTab';
import ConnectionStatus from './ConnectionStatus';
import { FitnessData } from '@/hooks/useFitnessIntegration';

interface GoogleFitTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConnected: boolean;
  isLoading: boolean;
  handleConnect: () => void;
  handleSync: () => void;
  healthData: FitnessData;
  lastSyncTime: string | null;
  historyPeriod: string;
  setHistoryPeriod: (period: string) => void;
  historyDataType: string;
  setHistoryDataType: (type: string) => void;
  historyData: any[];
  isLoadingHistory: boolean;
}

const GoogleFitTabs: React.FC<GoogleFitTabsProps> = ({
  activeTab,
  setActiveTab,
  isConnected,
  isLoading,
  handleConnect,
  handleSync,
  healthData,
  lastSyncTime,
  historyPeriod,
  setHistoryPeriod,
  historyDataType,
  setHistoryDataType,
  historyData,
  isLoadingHistory
}) => {
  if (!isConnected) {
    return (
      <ConnectionStatus 
        isConnected={isConnected} 
        isLoading={isLoading} 
        handleConnect={handleConnect} 
      />
    );
  }

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
          onClick={handleSync}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Now</span>
        </Button>
      </div>
      
      <TabsContent value="current" className="space-y-4 mt-2">
        <CurrentDataTab healthData={healthData} lastSyncTime={lastSyncTime} />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4 mt-2">
        <HistoricalDataTab 
          historyPeriod={historyPeriod}
          setHistoryPeriod={setHistoryPeriod}
          historyDataType={historyDataType}
          setHistoryDataType={setHistoryDataType}
          historyData={historyData}
          isLoadingHistory={isLoadingHistory}
        />
      </TabsContent>
    </Tabs>
  );
};

export default GoogleFitTabs;
