
import React from 'react';
import { CalendarEvent } from '@/hooks/calendar/types';
import AppointmentDetailsDialog from './AppointmentDetailsDialog';
import CalendarNavigation from './CalendarNavigation';
import CalendarViewRenderer from './CalendarViewRenderer';
import CalendarSkeleton from './CalendarSkeleton';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import { useCalendarDates } from '@/hooks/calendar/useCalendarDates';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarEvents';
import { useCalendarEventManager } from '@/hooks/calendar/useCalendarEventManager';

interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  events: CalendarEvent[];
  isLoading: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventsChange: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  view,
  events,
  isLoading,
  selectedDate,
  onDateSelect,
  onEventsChange
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

  const {
    createDialogOpen,
    editDialogOpen,
    editingEvent,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  } = useCalendarEventManager(onEventsChange);

  // Handler for when an event is clicked
  const handleEventClick = (event: CalendarEvent) => {
    if (event.isAvailable) {
      // If it's an available slot, open the create dialog
      openCreateDialog(event.start instanceof Date ? event.start : new Date(event.start));
    } else {
      // If it's a booked appointment, open the details dialog
      openEventDetails(event);
    }
  };

  // Handler for booking from the details dialog
  const handleBookFromDetails = () => {
    if (selectedEvent) {
      closeEventDetails();
      openEditDialog(selectedEvent);
    }
  };

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
        onEventClick={handleEventClick}
        onDateSelect={onDateSelect}
        isToday={isToday}
      />
      
      {selectedEvent && (
        <AppointmentDetailsDialog
          open={isDetailsOpen}
          onClose={closeEventDetails}
          event={selectedEvent}
          onEdit={handleBookFromDetails}
        />
      )}

      <CreateAppointmentDialog
        open={createDialogOpen}
        onClose={closeCreateDialog}
        onCreated={(eventData) => handleCreateEvent(eventData)}
        selectedDate={selectedDate}
      />

      {editingEvent && (
        <EditAppointmentDialog
          open={editDialogOpen}
          onClose={closeEditDialog}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          event={editingEvent}
        />
      )}
    </div>
  );
};

export default CalendarView;
