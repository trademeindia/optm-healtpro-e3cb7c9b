
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { HistoricalDataRequest, GoogleFitDataPoint } from '@/services/integrations/googleFitService';
import CurrentDataTab from './tabs/CurrentDataTab';
import HistoricalDataTab from './tabs/HistoricalDataTab';

interface SyncedDataViewProps {
  providerName: string;
  lastSyncTime?: string | null;
  healthData: FitnessData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  onSync: () => Promise<void>;
  getHistoricalData?: (query: HistoricalDataRequest) => Promise<GoogleFitDataPoint[]>;
}

const SyncedDataView: React.FC<SyncedDataViewProps> = ({
  providerName,
  lastSyncTime,
  healthData,
  activeTab,
  setActiveTab,
  isLoading,
  onSync,
  getHistoricalData
}) => {
  const [historyPeriod, setHistoryPeriod] = useState('7days');
  const [historyDataType, setHistoryDataType] = useState('steps');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistoricalData = async () => {
    if (!getHistoricalData) return;
    
    setIsLoadingHistory(true);
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      // Set start date based on selected period
      if (historyPeriod === '7days') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (historyPeriod === '30days') {
        startDate.setDate(endDate.getDate() - 30);
      } else if (historyPeriod === '90days') {
        startDate.setDate(endDate.getDate() - 90);
      }
      
      const data = await getHistoricalData({
        dataType: historyDataType,
        startDate,
        endDate
      });
      
      // Format data for the chart
      const formattedData = data.map(point => ({
        date: format(new Date(point.startTime), 'MMM dd'),
        value: point.value
      }));
      
      setHistoryData(formattedData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Fetch historical data when tab, period or data type changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistoricalData();
    }
  }, [activeTab, historyPeriod, historyDataType]);

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
        <HistoricalDataTab 
          providerName={providerName}
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

// Import format from date-fns at the top
import { format } from 'date-fns';

export default SyncedDataView;
