
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/hooks/calendar/types';
import { Skeleton } from '@/components/ui/skeleton';
import AppointmentDetailsDialog from './AppointmentDetailsDialog';
import CalendarNavigation from './CalendarNavigation';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import MonthView from './views/MonthView';

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
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    } 
    else if (view === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const startDay = startOfMonth.getDay();
      for (let i = 0; i < startDay; i++) {
        const date = new Date(startOfMonth);
        date.setDate(date.getDate() - (startDay - i));
        dates.push(date);
      }
      
      for (let i = 1; i <= endOfMonth.getDate(); i++) {
        dates.push(new Date(today.getFullYear(), today.getMonth(), i));
      }
      
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
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 h-[600px]">
          {Array(7).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-full w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CalendarNavigation
        selectedDate={selectedDate}
        view={view}
        onPrevious={navigateToPrevious}
        onNext={navigateToNext}
        onToday={navigateToToday}
      />
      
      {view === 'day' && (
        <DayView
          selectedDate={selectedDate}
          visibleHours={visibleHours}
          getEventsForHour={getEventsForHour}
          onEventClick={handleEventClick}
        />
      )}
      
      {view === 'week' && (
        <WeekView
          selectedDate={selectedDate}
          visibleDates={visibleDates}
          visibleHours={visibleHours}
          getEventsForHour={getEventsForHour}
          onEventClick={handleEventClick}
          isToday={isToday}
        />
      )}
      
      {view === 'month' && (
        <MonthView
          visibleDates={visibleDates}
          selectedDate={selectedDate}
          getEventsForDate={getEventsForDate}
          onDateSelect={onDateSelect}
          isToday={isToday}
        />
      )}
      
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
