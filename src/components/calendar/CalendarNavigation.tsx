
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface CalendarNavigationProps {
  selectedDate: Date;
  view: 'day' | 'week' | 'month';
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  selectedDate,
  view,
  onPrevious,
  onNext,
  onToday
}) => {
  const getHeaderText = () => {
    if (view === 'day') {
      return formatDate(selectedDate, "MMMM d, yyyy");
    } else if (view === 'week') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${formatDate(weekStart, "MMM d")} - ${formatDate(weekEnd, "MMM d, yyyy")}`;
    }
    return formatDate(selectedDate, "MMMM yyyy");
  };

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">
        {getHeaderText()}
      </h3>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onToday}>Today</Button>
      </div>
    </div>
  );
};

export default CalendarNavigation;
