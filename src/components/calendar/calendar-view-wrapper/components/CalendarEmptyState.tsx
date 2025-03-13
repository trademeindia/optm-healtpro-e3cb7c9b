
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';

interface CalendarEmptyStateProps {
  onReload: () => void;
  errorMessage?: string;
}

const CalendarEmptyState: React.FC<CalendarEmptyStateProps> = ({ 
  onReload,
  errorMessage 
}) => {
  return (
    <Card className="shadow-sm overflow-hidden border border-border/30">
      <CardContent className="p-6 flex flex-col items-center justify-center h-[450px] text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Calendar Not Available</h3>
        <p className="text-muted-foreground mb-4">
          {errorMessage || "We couldn't load your calendar at this time."}
        </p>
        <Button 
          onClick={onReload}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarEmptyState;
