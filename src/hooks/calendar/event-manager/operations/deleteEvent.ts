
import { toast } from 'sonner';

export const deleteEvent = async (
  eventId: string,
  onEventChange?: () => void,
  closeEditDialog?: () => void
): Promise<boolean> => {
  try {
    // In a real app, this would be an API call
    console.log('Deleting event:', eventId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let googleCalendarSyncSuccess = true;
    try {
      // This is where we would delete the event from Google Calendar
      console.log('Removing appointment from Google Calendar for ID:', eventId);
      
      // Simulate successful API call
      console.log('Successfully deleted from Google Calendar');
    } catch (googleError) {
      console.error('Google Calendar deletion error:', googleError);
      googleCalendarSyncSuccess = false;
    }
    
    // Dispatch a custom event to notify about appointment deletion
    window.dispatchEvent(new CustomEvent('appointment-deleted', { 
      detail: { id: eventId } 
    }));
    
    // Dispatch a calendar-updated event
    window.dispatchEvent(new Event('calendar-updated'));
    
    if (googleCalendarSyncSuccess) {
      toast.success('Appointment deleted successfully', {
        description: 'The appointment has been removed from your calendar',
        duration: 3000
      });
    } else {
      toast.error('Google Calendar sync failed', {
        description: 'The appointment was deleted locally, but failed to remove from Google Calendar.',
        duration: 5000
      });
    }
    
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
};
