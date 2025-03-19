import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHealthData } from '@/hooks/useHealthData';
import { FitnessConnection } from '@/services/health';
import { RefreshCw } from 'lucide-react';

interface HealthSyncProps {
  className?: string;
}

const HealthSync: React.FC<HealthSyncProps> = ({ className }) => {
  const { 
    isSyncing, 
    lastSyncTime, 
    syncData, 
    hasGoogleFitConnected,
    connections
  } = useHealthData();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleSync = async () => {
    setIsRefreshing(true);
    await syncData(true);
    setIsRefreshing(false);
  };
  
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Health Data Sync</CardTitle>
        <CardDescription>
          Manage your connected fitness providers and sync your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <p className="text-sm font-medium">Last Sync</p>
          <p className="text-muted-foreground">{formatDate(lastSyncTime)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Connected Providers</p>
          {connections.length > 0 ? (
            <ul>
              {connections.map((connection) => (
                <li key={connection.id} className="text-muted-foreground">
                  {connection.provider} - {connection.isConnected ? 'Connected' : 'Not Connected'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No providers connected</p>
          )}
        </div>
        <Button 
          onClick={handleSync} 
          disabled={isSyncing || isRefreshing || !hasGoogleFitConnected}
        >
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" style={{animationDuration: isSyncing || isRefreshing ? '1s' : '0s'}} />
          {isSyncing || isRefreshing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HealthSync;
