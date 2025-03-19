
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HealthSyncButtonProps {
  hasConnectedApps: boolean;
  onSyncData: () => Promise<void>;
}

const HealthSyncButton: React.FC<HealthSyncButtonProps> = ({
  hasConnectedApps,
  onSyncData
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  if (!hasConnectedApps) return null;
  
  const handleSyncClick = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      await onSyncData();
      toast.success("Health data synced successfully!", {
        duration: 3000
      });
    } catch (error) {
      console.error('Error syncing health data:', error);
      toast.error("There was an error syncing your health data. Please try again.", {
        duration: 5000
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="flex justify-end mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs gap-1.5"
        onClick={handleSyncClick}
        disabled={isSyncing}
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync Health Data'}
      </Button>
    </div>
  );
};

export default HealthSyncButton;
