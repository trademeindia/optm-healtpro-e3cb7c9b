
import React from 'react';
import { CalendarEvent } from '@/hooks/calendar/types';
import { AppointmentDetailsDialog } from '../appointment-details';

interface CalendarEventDetailsProps {
  selectedEvent: CalendarEvent | null;
  isDetailsOpen: boolean;
  closeEventDetails: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
}

const CalendarEventDetails: React.FC<CalendarEventDetailsProps> = ({
  selectedEvent,
  isDetailsOpen,
  closeEventDetails,
  onEdit,
  onStatusChange
}) => {
  if (!selectedEvent) return null;
  
  return (
    <AppointmentDetailsDialog
      open={isDetailsOpen}
      onClose={closeEventDetails}
      event={selectedEvent}
      onEdit={onEdit}
      onStatusChange={onStatusChange}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
    />
  );
};

export default CalendarEventDetails;
