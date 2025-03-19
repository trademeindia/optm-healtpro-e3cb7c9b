
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FitnessConnection } from '@/services/healthDataService';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface HealthSyncProps {
  connections: FitnessConnection[];
  lastSyncTime: Date | null;
  onManualSync: () => Promise<void>;
  isSyncing: boolean;
}

const HealthSync: React.FC<HealthSyncProps> = ({
  connections,
  lastSyncTime,
  onManualSync,
  isSyncing
}) => {
  // Format relative time (e.g., "2 minutes ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) {
      return 'Just now';
    }
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    }
    
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) {
      return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };
  
  // Get sync status
  const getSyncStatus = () => {
    if (!lastSyncTime) {
      return { status: 'never', text: 'Never synced', color: 'text-orange-500' };
    }
    
    const now = new Date();
    const diffMs = now.getTime() - lastSyncTime.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    
    if (diffMin < 5) {
      return { status: 'good', text: 'Up to date', color: 'text-green-500' };
    }
    
    if (diffMin < 60) {
      return { status: 'ok', text: 'Synced recently', color: 'text-blue-500' };
    }
    
    return { status: 'stale', text: 'Needs update', color: 'text-orange-500' };
  };
  
  const syncStatus = getSyncStatus();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 text-blue-500" />
          Health Data Synchronization
        </CardTitle>
        <CardDescription>
          Manage and monitor your health data connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Sync Status</h3>
              <div className="flex items-center mt-1">
                {syncStatus.status === 'good' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                )}
                <p className={`text-sm ${syncStatus.color}`}>
                  {syncStatus.text}
                </p>
              </div>
              {lastSyncTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last synchronized: {formatRelativeTime(lastSyncTime)} ({lastSyncTime.toLocaleString()})
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onManualSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Connected Services</h3>
            <div className="space-y-3">
              {connections.map((connection) => (
                <Card key={connection.id} className="bg-gray-50 dark:bg-gray-900/20">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium">
                          {connection.provider === 'google_fit' ? 'Google Fit' : connection.provider}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {connection.lastSync ? `Last sync: ${formatRelativeTime(new Date(connection.lastSync))}` : 'Never synced'}
                        </p>
                      </div>
                      <div>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {connections.length === 0 && (
                <p className="text-sm text-muted-foreground">No health services connected</p>
              )}
            </div>
          </div>
          
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800">
                  <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-200">Automatic Sync</h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Your health data is synchronized automatically every 30 seconds when you're using the app.
                    You can also manually sync your data anytime by clicking the "Sync Now" button.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSync;
