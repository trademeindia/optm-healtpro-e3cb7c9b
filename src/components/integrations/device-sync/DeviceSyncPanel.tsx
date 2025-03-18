
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Link2, Link2Off, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { FitnessProvider } from '@/components/dashboard/FitnessIntegrations';
import { FitnessData } from '@/hooks/useFitnessIntegration';

import ConnectView from './ConnectView';
import SyncedDataView from './SyncedDataView';
import LoadingView from './LoadingView';
import { useDeviceSync } from './useDeviceSync';

interface DeviceSyncPanelProps {
  provider: FitnessProvider;
  onHealthDataSync?: (data: FitnessData) => void;
  className?: string;
}

const DeviceSyncPanel: React.FC<DeviceSyncPanelProps> = ({ 
  provider,
  onHealthDataSync,
  className = ''
}) => {
  const {
    isConnected,
    isLoading,
    lastSyncTime,
    healthData,
    activeTab,
    setActiveTab,
    handleConnect,
    handleDisconnect,
    handleSync
  } = useDeviceSync(provider, onHealthDataSync);

  // Render content based on connection status
  const renderContent = () => {
    if (isLoading) {
      return <LoadingView />;
    }
    
    if (!isConnected) {
      return <ConnectView providerName={provider.name} onConnect={handleConnect} />;
    }
    
    return (
      <SyncedDataView
        providerName={provider.name}
        lastSyncTime={lastSyncTime}
        healthData={healthData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        onSync={handleSync}
      />
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {provider.logo && (
              <img 
                src={provider.logo} 
                alt={provider.name} 
                className="h-6 w-6 rounded-full mr-2" 
              />
            )}
            <div>
              <CardTitle>{provider.name} Integration</CardTitle>
              <CardDescription>
                Sync your health and fitness data
              </CardDescription>
            </div>
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
          Last synchronized: {format(new Date(), 'MMMM d, yyyy')} at {lastSyncTime}
        </CardFooter>
      )}
    </Card>
  );
};

export default DeviceSyncPanel;
