
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HealthDataSyncProps {
  onSyncData: () => void;
  hasConnectedApps: boolean;
}

const HealthDataSync: React.FC<HealthDataSyncProps> = ({ 
  onSyncData,
  hasConnectedApps
}) => {
  if (!hasConnectedApps) return null;
  
  return (
    <div className="flex justify-end mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs gap-1.5"
        onClick={onSyncData}
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Sync Health Data
      </Button>
    </div>
  );
};

export default HealthDataSync;
