
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarEvent } from '@/hooks/useCalendarIntegration';
import { toast } from 'sonner';
import { cn, formatDate } from '@/lib/utils';
import AppointmentDetailsDialog from './AppointmentDetailsDialog';

interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  events: CalendarEvent[];
  isLoading: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  view,
  events,
  isLoading,
  selectedDate,
  onDateSelect
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [visibleHours, setVisibleHours] = useState<number[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Calculate visible dates based on view and selected date
  useEffect(() => {
    const dates: Date[] = [];
    const today = new Date(selectedDate);
    
    if (view === 'day') {
      dates.push(today);
    } 
    else if (view === 'week') {
      // Start from Sunday
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    } 
    else if (view === 'month') {
      // Start from first day of month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      // Include last days of previous month if month doesn't start on Sunday
      const startDay = startOfMonth.getDay();
      for (let i = 0; i < startDay; i++) {
        const date = new Date(startOfMonth);
        date.setDate(date.getDate() - (startDay - i));
        dates.push(date);
      }
      
      // Add all days of current month
      for (let i = 1; i <= endOfMonth.getDate(); i++) {
        dates.push(new Date(today.getFullYear(), today.getMonth(), i));
      }
      
      // Fill in remaining days to complete the grid (42 cells = 6 weeks)
      const remainingDays = 42 - dates.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(endOfMonth);
        date.setDate(date.getDate() + i);
        dates.push(date);
      }
    }
    
    setVisibleDates(dates);
  }, [selectedDate, view]);

  // Set visible hours (8 AM to 6 PM by default)
  useEffect(() => {
    const hours = [];
    for (let hour = 8; hour <= 18; hour++) {
      hours.push(hour);
    }
    setVisibleHours(hours);
  }, []);

  const navigateToPrevious = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    onDateSelect(newDate);
  };

  const navigateToNext = () => {
    const newDate = new Date(selectedDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateSelect(newDate);
  };

  const navigateToToday = () => {
    onDateSelect(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  // Determine if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
    });
  };

  // Get events for a specific hour on a specific date
  const getEventsForHour = (date: Date, hour: number): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getHours() === hour;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 h-[600px]">
          {Array(7).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-full w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Render Day View
  if (view === 'day') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {formatDate(selectedDate, "MMMM d, yyyy")}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={navigateToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={navigateToToday}>Today</Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-1 divide-y">
            {visibleHours.map(hour => {
              const eventsForHour = getEventsForHour(selectedDate, hour);
              return (
                <div key={hour} className="min-h-[100px]">
                  <div className="flex">
                    <div className="border-r p-2 w-20 text-sm text-muted-foreground">
                      {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour-12} PM` : `${hour} AM`}
                    </div>
                    <div className="flex-1 p-1">
                      {eventsForHour.map(event => (
                        <div 
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={cn(
                            "p-2 mb-1 rounded text-sm cursor-pointer",
                            event.isAvailable ? "bg-green-100 hover:bg-green-200 text-green-800" : 
                              "bg-blue-100 hover:bg-blue-200 text-blue-800"
                          )}
                        >
                          <div className="font-medium">
                            {event.isAvailable ? 'Available' : 'Booked'}
                          </div>
                          <div className="text-xs">
                            {formatDate(event.start, "h:mm a")} - {formatDate(event.end, "h:mm a")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {selectedEvent && (
          <AppointmentDetailsDialog
            open={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            event={selectedEvent}
          />
        )}
      </div>
    );
  }

  // Render Week View
  if (view === 'week') {
    const weekStart = new Date(visibleDates[0]);
    const weekEnd = new Date(visibleDates[visibleDates.length - 1]);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {formatDate(weekStart, "MMM d")} - {formatDate(weekEnd, "MMM d, yyyy")}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={navigateToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={navigateToToday}>Today</Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          {/* Days header */}
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
          
          {/* Hours grid */}
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
                            onClick={() => handleEventClick(event)}
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
        
        {selectedEvent && (
          <AppointmentDetailsDialog
            open={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            event={selectedEvent}
          />
        )}
      </div>
    );
  }

  // Render Month View
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {formatDate(selectedDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={navigateToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={navigateToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={navigateToToday}>Today</Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y">
          {visibleDates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
            const dateEvents = getEventsForDate(date);
            const availableCount = dateEvents.filter(e => e.isAvailable).length;
            const bookedCount = dateEvents.filter(e => !e.isAvailable).length;
            
            return (
              <div 
                key={index} 
                className={cn(
                  "min-h-[100px] p-1",
                  isCurrentMonth ? "" : "bg-gray-50",
                  isToday(date) ? "bg-primary/10" : ""
                )}
                onClick={() => onDateSelect(date)}
              >
                <div className={cn(
                  "text-right p-1",
                  isCurrentMonth ? "" : "text-muted-foreground"
                )}>
                  <span className={cn(
                    "inline-block w-6 h-6 text-center",
                    isToday(date) ? "bg-primary text-primary-foreground rounded-full" : ""
                  )}>
                    {date.getDate()}
                  </span>
                </div>
                
                {dateEvents.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {availableCount > 0 && (
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded truncate">
                        {availableCount} available
                      </div>
                    )}
                    {bookedCount > 0 && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate">
                        {bookedCount} booked
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedEvent && (
        <AppointmentDetailsDialog
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default CalendarView;
