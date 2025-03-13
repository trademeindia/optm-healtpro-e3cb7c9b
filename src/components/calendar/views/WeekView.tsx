import React from 'react';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CalendarViewProps } from './types';
const WeekView: React.FC<CalendarViewProps> = ({
  visibleDates,
  visibleHours,
  getEventsForHour,
  onEventClick,
  isToday
}) => {
  return <div className="border rounded-md overflow-hidden">
      <div className="grid grid-cols-8 border-b">
        <div className="p-2 text-center border-r"></div>
        {visibleDates.map((date, index) => <div key={index} className={cn("p-2 text-center font-medium", isToday(date) ? "bg-primary/10" : "")}>
            <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}</div>
            <div className={cn("text-sm", isToday(date) ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center mx-auto" : "")}>
              {date.getDate()}
            </div>
          </div>)}
      </div>
      
      <div className="grid grid-cols-1 divide-y">
        {visibleHours.map(hour => {})}
      </div>
    </div>;
};
export default WeekView;