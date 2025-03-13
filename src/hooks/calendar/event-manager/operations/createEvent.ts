
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent } from '../../types';
import { getAppointmentColor } from '../utils/appointmentColors';

export const createEvent = async (
  eventData: Partial<CalendarEvent>,
  validateEventData: (data: Partial<CalendarEvent>) => boolean,
  onEventChange?: () => void,
  setIsCreating?: (value: boolean) => void,
  currentUser?: any // Pass the current user from useAuth for permissions
): Promise<boolean> => {
  try {
    if (!validateEventData(eventData)) {
      throw new Error("Invalid appointment data");
    }
    
    // Check if user has permission to create this type of event
    if (currentUser && currentUser.role === 'patient') {
      // Patients can only create appointments for themselves
      // Ensure the patient name matches their own name
      if (!eventData.patientName || !eventData.patientName.includes(currentUser.name)) {
        eventData.patientName = currentUser.name;
        console.log("Auto-assigning patient name to current user:", currentUser.name);
      }
      
      // Add patient metadata for filtering
      (eventData as any).patientId = currentUser.patientId || currentUser.id;
    }
    
    // Ensure start and end dates are properly formatted as Date objects
    if (eventData.start && !(eventData.start instanceof Date)) {
      eventData.start = new Date(eventData.start);
    }
    
    if (eventData.end && !(eventData.end instanceof Date)) {
      eventData.end = new Date(eventData.end);
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
      // For demo purposes, we're simulating the Google Calendar API call
      console.log('Syncing appointment to Google Calendar:', {
        summary: completeEventData.title,
        description: completeEventData.description,
        start: { 
          dateTime: completeEventData.start instanceof Date 
            ? completeEventData.start.toISOString() 
            : new Date(completeEventData.start).toISOString() 
        },
        end: { 
          dateTime: completeEventData.end instanceof Date 
            ? completeEventData.end.toISOString() 
            : new Date(completeEventData.end).toISOString() 
        },
        location: completeEventData.location,
        colorId: completeEventData.color
      });
      
      // Ensure the AppointmentsList component refreshes by dispatching a detailed event
      window.dispatchEvent(new CustomEvent('appointment-created', { 
        detail: completeEventData 
      }));
      
      // Trigger a general calendar refresh event
      window.dispatchEvent(new CustomEvent('calendar-updated', {
        detail: { action: 'create', appointment: completeEventData }
      }));
      
      // Dispatch an additional event to force refresh of any appointment UI components
      window.dispatchEvent(new CustomEvent('calendar-data-updated', {
        detail: { timestamp: new Date().toISOString() }
      }));
      
      // Simulate successful API call
      console.log('Successfully synced with Google Calendar');
    } catch (googleError) {
      console.error('Google Calendar sync error:', googleError);
      googleCalendarSyncSuccess = false;
      // Still continue with local appointment creation even if Google sync fails
    }
    
    // Force a refresh of the calendar data to ensure the new appointment shows up in all places
    if (onEventChange) {
      console.log("Triggering calendar refresh after create");
      onEventChange();
      
      // Additional delay to ensure all components refresh
      setTimeout(() => {
        window.dispatchEvent(new Event('calendar-updated'));
        onEventChange(); // Call again for good measure
      }, 500);
      
      // Schedule one more refresh after a longer delay to ensure everything is updated
      setTimeout(() => {
        window.dispatchEvent(new Event('calendar-updated'));
        onEventChange();
        console.log("Final refresh after appointment creation");
      }, 1500);
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
