
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HealthSyncButtonProps {
  hasConnectedApps: boolean;
  onSyncData: () => Promise<void>;
}

const HealthSyncButton: React.FC<HealthSyncButtonProps> = ({
  hasConnectedApps,
  onSyncData
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

export default HealthSyncButton;
