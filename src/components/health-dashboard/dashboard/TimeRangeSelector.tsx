
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { TimeRange } from '@/services/health';

interface TimeRangeSelectorProps {
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedTimeRange,
  onTimeRangeChange
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time Range:</span>
      </div>
      <div className="flex space-x-1">
        <Button 
          variant={selectedTimeRange === 'day' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onTimeRangeChange('day')}
        >
          Day
        </Button>
        <Button 
          variant={selectedTimeRange === 'week' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onTimeRangeChange('week')}
        >
          Week
        </Button>
        <Button 
          variant={selectedTimeRange === 'month' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onTimeRangeChange('month')}
        >
          Month
        </Button>
        <Button 
          variant={selectedTimeRange === 'year' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onTimeRangeChange('year')}
        >
          Year
        </Button>
      </div>
    </div>
  );
};

export default TimeRangeSelector;
