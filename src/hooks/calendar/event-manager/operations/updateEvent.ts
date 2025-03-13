
import { toast } from 'sonner';
import { CalendarEvent } from '../../types';
import { getAppointmentColor } from '../utils/appointmentColors';

export const updateEvent = async (
  eventId: string,
  eventData: Partial<CalendarEvent>,
  validateEventData: (data: Partial<CalendarEvent>) => boolean,
  onEventChange?: () => void,
  setIsEditing?: (value: boolean) => void,
  closeEditDialog?: () => void
): Promise<boolean> => {
  try {
    if (!validateEventData(eventData)) {
      throw new Error("Invalid appointment data");
    }
    
    // Add color based on type if updating type
    if (eventData.type) {
      eventData.color = getAppointmentColor(eventData.type);
    }
    
    // In a real app, this would be an API call
    console.log('Updating event:', eventId, {
      title: eventData.title,
      start: eventData.start instanceof Date ? eventData.start.toISOString() : eventData.start,
      end: eventData.end instanceof Date ? eventData.end.toISOString() : eventData.end,
      type: eventData.type,
      patientName: eventData.patientName,
      location: eventData.location,
      status: eventData.status || 'scheduled',
      color: eventData.color
    });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let googleCalendarSyncSuccess = true;
    try {
      // This is where we would update the event in Google Calendar
      console.log('Syncing updated appointment to Google Calendar for ID:', eventId);
      
      // Simulate successful API call
      console.log('Successfully updated in Google Calendar');
    } catch (googleError) {
      console.error('Google Calendar update error:', googleError);
      googleCalendarSyncSuccess = false;
    }
    
    // Dispatch a custom event to notify about appointment update
    window.dispatchEvent(new CustomEvent('appointment-updated', { 
      detail: { id: eventId, ...eventData } 
    }));
    
    // Dispatch a calendar-updated event
    window.dispatchEvent(new Event('calendar-updated'));
    
    if (googleCalendarSyncSuccess) {
      toast.success('Appointment updated successfully', {
        description: 'Your appointment details have been updated',
        duration: 3000
      });
    } else {
      toast.error('Google Calendar sync failed', {
        description: 'The appointment was updated locally, but failed to sync with Google Calendar.',
        duration: 5000
      });
    }
    
    // Notify parent components that events have changed
    if (onEventChange) {
      console.log("Triggering calendar refresh after update");
      onEventChange();
    }
    
    return true;
  } catch (error) {
    console.error('Error updating event:', error);
    
    toast.error('Failed to update appointment', {
      description: 'There was an error updating your appointment. Please try again.',
      duration: 3000
    });
    
    return false;
  } finally {
    if (setIsEditing) setIsEditing(false);
    if (closeEditDialog) closeEditDialog();
  }
};
