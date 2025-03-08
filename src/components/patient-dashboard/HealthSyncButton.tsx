
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
  const { toast } = useToast();
  
  if (!hasConnectedApps) return null;
  
  const handleSyncClick = async () => {
    try {
      await onSyncData();
    } catch (error) {
      console.error('Error syncing health data:', error);
      toast({
        title: "Sync failed",
        description: "There was an error syncing your health data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex justify-end mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs gap-1.5"
        onClick={handleSyncClick}
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Sync Health Data
      </Button>
    </div>
  );
};

export default HealthSyncButton;
