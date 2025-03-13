
import { useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent } from '../types';
import { useEventValidator } from './useEventValidator';
import { EventOperations } from './types';

export const useEventOperations = (
  onEventChange?: () => void,
  setIsCreating?: (value: boolean) => void,
  setIsEditing?: (value: boolean) => void,
  closeEditDialog?: () => void
): EventOperations => {
  const { validateEventData } = useEventValidator();

  const handleCreateEvent = useCallback(async (eventData: Partial<CalendarEvent>): Promise<boolean> => {
    if (setIsCreating) setIsCreating(true);
    
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
        ...(eventData as any)
      };
      
      console.log('Creating event with data:', completeEventData);
      
      // Simulate API call to create event in Google Calendar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // This is where we would make the actual API call to Google Calendar
        console.log('Syncing appointment to Google Calendar:', {
          summary: completeEventData.title,
          description: completeEventData.description,
          start: { dateTime: completeEventData.start },
          end: { dateTime: completeEventData.end },
          location: completeEventData.location
        });
        
        // Simulate successful API call
        console.log('Successfully synced with Google Calendar');
      } catch (googleError) {
        console.error('Google Calendar sync error:', googleError);
        // Still continue with local appointment creation even if Google sync fails
        toast.error('Google Calendar sync failed', {
          description: 'The appointment was saved locally, but failed to sync with Google Calendar.',
          duration: 5000
        });
      }
      
      // Dispatch a custom event to notify about appointment creation
      window.dispatchEvent(new CustomEvent('appointment-created', { 
        detail: completeEventData 
      }));
      
      // Notify parent components that events have changed
      if (onEventChange) {
        console.log("Triggering calendar refresh after create");
        onEventChange();
      }
      
      // Dispatch a calendar-updated event
      window.dispatchEvent(new Event('calendar-updated'));
      
      // Show a success message with the appointment details
      toast.success(`Appointment created: ${completeEventData.title}`, {
        description: `${new Date(completeEventData.start).toLocaleString()} - ${new Date(completeEventData.end).toLocaleTimeString()}`,
        duration: 3000
      });
      
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
  }, [validateEventData, onEventChange, setIsCreating]);

  const handleUpdateEvent = useCallback(async (
    eventId: string, 
    eventData: Partial<CalendarEvent>
  ): Promise<boolean> => {
    if (setIsEditing) setIsEditing(true);
    
    try {
      if (!validateEventData(eventData)) {
        throw new Error("Invalid appointment data");
      }
      
      // In a real app, this would be an API call
      console.log('Updating event:', eventId, {
        title: eventData.title,
        start: eventData.start instanceof Date ? eventData.start.toISOString() : eventData.start,
        end: eventData.end instanceof Date ? eventData.end.toISOString() : eventData.end,
        type: eventData.type,
        patientName: eventData.patientName,
        location: eventData.location,
        status: eventData.status || 'scheduled'
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // This is where we would update the event in Google Calendar
        console.log('Syncing updated appointment to Google Calendar for ID:', eventId);
        
        // Simulate successful API call
        console.log('Successfully updated in Google Calendar');
      } catch (googleError) {
        console.error('Google Calendar update error:', googleError);
        toast.error('Google Calendar sync failed', {
          description: 'The appointment was updated locally, but failed to sync with Google Calendar.',
          duration: 5000
        });
      }
      
      // Dispatch a custom event to notify about appointment update
      window.dispatchEvent(new CustomEvent('appointment-updated', { 
        detail: { id: eventId, ...eventData } 
      }));
      
      // Dispatch a calendar-updated event
      window.dispatchEvent(new Event('calendar-updated'));
      
      toast.success('Appointment updated successfully', {
        description: 'Your appointment details have been updated',
        duration: 3000
      });
      
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
  }, [validateEventData, onEventChange, setIsEditing, closeEditDialog]);

  const handleDeleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      console.log('Deleting event:', eventId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // This is where we would delete the event from Google Calendar
        console.log('Removing appointment from Google Calendar for ID:', eventId);
        
        // Simulate successful API call
        console.log('Successfully deleted from Google Calendar');
      } catch (googleError) {
        console.error('Google Calendar deletion error:', googleError);
        toast.error('Google Calendar sync failed', {
          description: 'The appointment was deleted locally, but failed to remove from Google Calendar.',
          duration: 5000
        });
      }
      
      // Dispatch a custom event to notify about appointment deletion
      window.dispatchEvent(new CustomEvent('appointment-deleted', { 
        detail: { id: eventId } 
      }));
      
      // Dispatch a calendar-updated event
      window.dispatchEvent(new Event('calendar-updated'));
      
      toast.success('Appointment deleted successfully', {
        description: 'The appointment has been removed from your calendar',
        duration: 3000
      });
      
      // Notify parent components that events have changed
      if (onEventChange) {
        console.log("Triggering calendar refresh after delete");
        onEventChange();
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      
      toast.error('Failed to delete appointment', {
        description: 'There was an error deleting the appointment. Please try again.',
        duration: 3000
      });
      
      return false;
    } finally {
      if (closeEditDialog) closeEditDialog();
    }
  }, [onEventChange, closeEditDialog]);

  return {
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  };
};
