
import React, { useState } from 'react';
import { useGoogleFitIntegration } from '@/hooks/useGoogleFitIntegration';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Link2Off } from 'lucide-react';
import GoogleFitTabs from './google-fit/GoogleFitTabs';
import { GoogleFitSyncPanelProps } from './google-fit/types';

const GoogleFitSyncPanel: React.FC<GoogleFitSyncPanelProps> = ({ 
  onHealthDataSync,
  className = ''
}) => {
  const {
    isConnected,
    isLoading,
    connectGoogleFit,
    disconnectGoogleFit,
    syncGoogleFitData,
    lastSyncTime,
    healthData,
    getHistoricalData
  } = useGoogleFitIntegration();

  const [activeTab, setActiveTab] = useState('current');
  const [historyPeriod, setHistoryPeriod] = useState('7days');
  const [historyDataType, setHistoryDataType] = useState('steps');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const handleConnect = () => {
    if (!isConnected) {
      connectGoogleFit();
    }
  };

  const handleDisconnect = async () => {
    if (isConnected) {
      await disconnectGoogleFit();
    }
  };

  const handleSync = async () => {
    if (isConnected) {
      const syncedData = await syncGoogleFitData();
      if (onHealthDataSync) {
        onHealthDataSync(syncedData);
      }
    }
  };

  const fetchHistoricalData = async () => {
    if (!isConnected) return;
    
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
  React.useEffect(() => {
    if (activeTab === 'history') {
      fetchHistoricalData();
    }
  }, [activeTab, historyPeriod, historyDataType]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Google Fit Integration</CardTitle>
            <CardDescription>
              Sync your health and fitness data
            </CardDescription>
          </div>
          {isConnected && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDisconnect}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Link2Off className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <GoogleFitTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isConnected={isConnected}
          isLoading={isLoading}
          handleConnect={handleConnect}
          handleSync={handleSync}
          healthData={healthData}
          lastSyncTime={lastSyncTime}
          historyPeriod={historyPeriod}
          setHistoryPeriod={setHistoryPeriod}
          historyDataType={historyDataType}
          setHistoryDataType={setHistoryDataType}
          historyData={historyData}
          isLoadingHistory={isLoadingHistory}
        />
      </CardContent>
      {isConnected && lastSyncTime && (
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          Last synchronized: {format(new Date(lastSyncTime), 'MMMM d, yyyy h:mm a')}
        </CardFooter>
      )}
    </Card>
  );
};

export default GoogleFitSyncPanel;
