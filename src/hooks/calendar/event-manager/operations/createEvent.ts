
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent } from '../../types';
import { getAppointmentColor } from '../utils/appointmentColors';

export const createEvent = async (
  eventData: Partial<CalendarEvent>,
  validateEventData: (data: Partial<CalendarEvent>) => boolean,
  onEventChange?: () => void,
  setIsCreating?: (value: boolean) => void
): Promise<boolean> => {
  try {
    if (!validateEventData(eventData)) {
      throw new Error("Invalid appointment data");
    }
    
    // Add a unique ID to the event
    const completeEventData: CalendarEvent = {
      id: uuidv4(),
      title: eventData.title || 'Untitled Event',
      start: eventData.start as Date,
      end: eventData.end as Date,
      allDay: eventData.allDay || false,
      description: eventData.description || '',
      location: eventData.location || '',
      patientName: eventData.patientName || '',
      type: eventData.type || '',
      status: 'scheduled',
      color: getAppointmentColor(eventData.type || ''),
      ...(eventData as any)
    };
    
    console.log('Creating event with data:', completeEventData);
    
    // Simulate API call to create event in Google Calendar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let googleCalendarSyncSuccess = true;
    try {
      // This is where we would make the actual API call to Google Calendar
      console.log('Syncing appointment to Google Calendar:', {
        summary: completeEventData.title,
        description: completeEventData.description,
        start: { dateTime: completeEventData.start },
        end: { dateTime: completeEventData.end },
        location: completeEventData.location,
        colorId: completeEventData.color
      });
      
      // Simulate successful API call
      console.log('Successfully synced with Google Calendar');
    } catch (googleError) {
      console.error('Google Calendar sync error:', googleError);
      googleCalendarSyncSuccess = false;
      // Still continue with local appointment creation even if Google sync fails
    }
    
    // First dispatch a custom event to notify about appointment creation
    window.dispatchEvent(new CustomEvent('appointment-created', { 
      detail: completeEventData 
    }));
    
    // Then dispatch a calendar-updated event
    setTimeout(() => {
      window.dispatchEvent(new Event('calendar-updated'));
    }, 500);
    
    // Notify parent components that events have changed
    if (onEventChange) {
      console.log("Triggering calendar refresh after create");
      setTimeout(() => {
        onEventChange();
      }, 1000); // Add delay to allow Google Calendar iframe to reload first
    }
    
    // Show appropriate success/error message
    if (googleCalendarSyncSuccess) {
      toast.success(`Appointment created: ${completeEventData.title}`, {
        description: `${new Date(completeEventData.start).toLocaleString()} - ${new Date(completeEventData.end).toLocaleTimeString()}`,
        duration: 3000
      });
    } else {
      toast.error('Google Calendar sync failed', {
        description: 'The appointment was saved locally, but failed to sync with Google Calendar. Please try again.',
        duration: 5000
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating event:', error);
    
    toast.error('Failed to create appointment', {
      description: 'There was an error creating your appointment. Please try again.',
      duration: 5000
    });
    
    return false;
  } finally {
    if (setIsCreating) setIsCreating(false);
  }
};
