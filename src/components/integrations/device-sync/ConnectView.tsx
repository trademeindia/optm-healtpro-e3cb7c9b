
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link2 } from 'lucide-react';

interface ConnectViewProps {
  providerName: string;
  onConnect: () => void;
}

const ConnectView: React.FC<ConnectViewProps> = ({ providerName, onConnect }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <Link2 className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">Connect to {providerName}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        Sync your health and fitness data from {providerName} to track your progress and gain insights about your health.
      </p>
      <Button onClick={onConnect} className="gap-2">
        <Link2 className="h-4 w-4" />
        <span>Connect {providerName}</span>
      </Button>
    </div>
  );
};

export default ConnectView;
