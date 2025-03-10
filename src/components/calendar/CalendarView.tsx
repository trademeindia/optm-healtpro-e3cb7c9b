import React, { forwardRef, useImperativeHandle } from 'react';
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
import { AppointmentStatusIndicator } from './AppointmentStatusIndicator';
import { Appointment, AppointmentStatus } from '@/types/appointment';

interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  events: CalendarEvent[];
  isLoading: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventsChange: () => void;
}

const CalendarView = forwardRef<{ openCreateDialog: (date: Date) => void }, CalendarViewProps>(({
  view,
  events,
  isLoading,
  selectedDate,
  onDateSelect,
  onEventsChange
}, ref) => {
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

  useImperativeHandle(ref, () => ({
    openCreateDialog: (date: Date) => {
      openCreateDialog(date);
    }
  }));

  const handleEventClick = (event: CalendarEvent) => {
    if (event.isAvailable) {
      openCreateDialog(event.start instanceof Date ? event.start : new Date(event.start));
    } else {
      openEventDetails(event);
    }
  };

  const handleBookFromDetails = () => {
    if (selectedEvent) {
      closeEventDetails();
      openEditDialog(selectedEvent);
    }
  };

  const handleEventCreated = async (eventData: Partial<CalendarEvent>) => {
    const success = await handleCreateEvent(eventData);
    if (success) {
      closeCreateDialog();
      onEventsChange();
    }
    return success;
  };

  const renderEventContent = (event: CalendarEvent) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="font-medium truncate">{event.title}</div>
        {event.status && (
          <AppointmentStatusIndicator status={event.status as AppointmentStatus} />
        )}
      </div>
    );
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
        onCreated={handleEventCreated}
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
});

CalendarView.displayName = 'CalendarView';

export default CalendarView;
