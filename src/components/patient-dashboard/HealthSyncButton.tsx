
import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthSyncButtonProps {
  hasConnectedApps: boolean;
  onSyncData: () => void;
}

const HealthSyncButton: React.FC<HealthSyncButtonProps> = ({ 
  hasConnectedApps, 
  onSyncData 
}) => {
  return (
    <Card className={cn(
      "border",
      hasConnectedApps 
        ? "border-border shadow-sm" 
        : "border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-900/10"
    )}>
      <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {hasConnectedApps ? (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-sm sm:text-base">
              {hasConnectedApps ? 'Sync Health Data' : 'Connect Health Apps'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              {hasConnectedApps 
                ? 'Update your health metrics by syncing with your connected health apps.'
                : 'Connect your health apps to automatically track your metrics and activity.'
              }
            </p>
          </div>
        </div>
        
        <Button 
          onClick={onSyncData}
          className={cn(
            "whitespace-nowrap",
            !hasConnectedApps && "bg-yellow-600 hover:bg-yellow-700 text-white"
          )}
          variant={hasConnectedApps ? "default" : "outline"}
        >
          {hasConnectedApps ? 'Sync Now' : 'Connect Apps'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HealthSyncButton;
