
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
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="grid grid-cols-8 border-b">
        <div className="p-2 text-center border-r"></div>
        {visibleDates.map((date, index) => (
          <div 
            key={index} 
            className={cn(
              "p-2 text-center font-medium", 
              isToday(date) ? "bg-primary/10" : ""
            )}
          >
            <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}</div>
            <div className={cn(
              "text-sm mx-auto flex items-center justify-center w-7 h-7", 
              isToday(date) ? "bg-primary text-primary-foreground rounded-full" : ""
            )}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 divide-y">
        {visibleHours.map(hour => (
          <div key={hour} className="grid grid-cols-8">
            <div className="p-2 text-xs text-center border-r text-muted-foreground">
              {hour}:00
            </div>
            {visibleDates.map((date, dayIndex) => {
              const events = getEventsForHour(date, hour);
              return (
                <div key={dayIndex} className="p-1 min-h-[60px] relative border-r last:border-r-0">
                  {events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      onClick={() => onEventClick(event)}
                      className="bg-primary/80 text-primary-foreground rounded-md p-1 mb-1 text-xs cursor-pointer hover:bg-primary transition-colors overflow-hidden"
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="truncate">{formatDate(event.start, 'h:mm a')} - {formatDate(event.end, 'h:mm a')}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
