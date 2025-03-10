
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
              "text-sm", 
              isToday(date) ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center mx-auto" : ""
            )}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 divide-y">
        {visibleHours.map(hour => (
          <div key={hour} className="min-h-[80px]">
            <div className="grid grid-cols-8">
              <div className="border-r p-2 text-sm text-muted-foreground text-center">
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour-12} PM` : `${hour} AM`}
              </div>
              
              {visibleDates.map((date, dateIndex) => {
                const eventsForHour = getEventsForHour(date, hour);
                return (
                  <div key={dateIndex} className="p-1 border-r last:border-r-0">
                    {eventsForHour.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={cn(
                          "p-1 mb-1 rounded text-xs cursor-pointer",
                          event.isAvailable ? "bg-green-100 hover:bg-green-200 text-green-800" : 
                            "bg-blue-100 hover:bg-blue-200 text-blue-800"
                        )}
                      >
                        <div className="truncate">
                          {event.isAvailable ? 'Available' : 'Booked'}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
