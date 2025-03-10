
import React from 'react';
import { CalendarEvent } from '@/hooks/calendar/types';
import { Skeleton } from '@/components/ui/skeleton';
import AppointmentDetailsDialog from './AppointmentDetailsDialog';
import CalendarNavigation from './CalendarNavigation';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import MonthView from './views/MonthView';
import { useCalendarDates } from '@/hooks/calendar/useCalendarDates';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarEvents';

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
  const {
    visibleDates,
    visibleHours,
    navigateToPrevious,
    navigateToNext,
    navigateToToday,
    isToday
  } = useCalendarDates(view, selectedDate, onDateSelect);

  const {
    selectedEvent,
    isDetailsOpen,
    openEventDetails,
    closeEventDetails,
    getEventsForDate,
    getEventsForHour
  } = useCalendarEvents(events);

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
          onEventClick={openEventDetails}
        />
      )}
      
      {view === 'week' && (
        <WeekView
          selectedDate={selectedDate}
          visibleDates={visibleDates}
          visibleHours={visibleHours}
          getEventsForHour={getEventsForHour}
          onEventClick={openEventDetails}
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
          onClose={closeEventDetails}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default CalendarView;
