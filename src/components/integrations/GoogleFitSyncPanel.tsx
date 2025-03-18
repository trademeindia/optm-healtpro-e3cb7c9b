
import React, { useState } from 'react';
import { useGoogleFitIntegration } from '@/hooks/useGoogleFitIntegration';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Link2Off } from 'lucide-react';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import ConnectView from './device-sync/ConnectView';
import LoadingView from './device-sync/LoadingView';
import SyncedDataView from './device-sync/SyncedDataView';

interface GoogleFitSyncPanelProps {
  onHealthDataSync?: (data: FitnessData) => void;
  className?: string;
}

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

  // Render content based on connection status
  const renderContent = () => {
    if (isLoading) {
      return <LoadingView />;
    }
    
    if (!isConnected) {
      return <ConnectView providerName="Google Fit" onConnect={handleConnect} />;
    }
    
    return (
      <SyncedDataView
        providerName="Google Fit"
        lastSyncTime={lastSyncTime}
        healthData={healthData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        onSync={handleSync}
        getHistoricalData={getHistoricalData}
      />
    );
  };
  
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
        {renderContent()}
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
