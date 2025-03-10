
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ConnectCalendarCardProps {
  isConnecting: boolean;
  onConnect: () => Promise<void>;
}

const ConnectCalendarCard: React.FC<ConnectCalendarCardProps> = ({
  isConnecting,
  onConnect
}) => {
  return (
    <div className="border border-dashed rounded-lg p-8 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Connect Google Calendar</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Connect your Google Calendar to manage appointments and sync your schedule
        </p>
        <Button 
          onClick={onConnect} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Connect Calendar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConnectCalendarCard;
