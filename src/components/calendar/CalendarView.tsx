
import React from 'react';
import { CalendarEvent } from '@/hooks/calendar/types';
import AppointmentDetailsDialog from './AppointmentDetailsDialog';
import CalendarNavigation from './CalendarNavigation';
import CalendarViewRenderer from './CalendarViewRenderer';
import CalendarSkeleton from './CalendarSkeleton';
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
    return <CalendarSkeleton />;
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
      
      <CalendarViewRenderer
        view={view}
        selectedDate={selectedDate}
        visibleDates={visibleDates}
        visibleHours={visibleHours}
        getEventsForDate={getEventsForDate}
        getEventsForHour={getEventsForHour}
        onEventClick={openEventDetails}
        onDateSelect={onDateSelect}
        isToday={isToday}
      />
      
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
