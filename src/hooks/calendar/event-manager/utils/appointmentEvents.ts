
import { AppointmentStatus } from '@/types/appointment';

// Create centralized event emitters for appointment updates
export const emitAppointmentUpdated = (
  id: string, 
  status: AppointmentStatus,
  additionalDetails?: Record<string, any>
) => {
  if (!id || !status) {
    console.error('Invalid parameters for appointment update event', { id, status });
    return;
  }
  
  console.log(`Emitting appointment update event for ${id} with status ${status}`);
  
  try {
    const detail = { 
      id, 
      status,
      timestamp: new Date().toISOString(),
      ...additionalDetails
    };
    
    // Dispatch with try-catch to avoid errors breaking the app
    try {
      window.dispatchEvent(new CustomEvent('appointment-updated', { detail }));
    } catch (error) {
      console.error('Error dispatching appointment-updated event:', error);
    }
    
    // Also dispatch a calendar-updated event to refresh calendar views
    try {
      window.dispatchEvent(new Event('calendar-updated'));
    } catch (error) {
      console.error('Error dispatching calendar-updated event:', error);
    }
    
    // Log success
    console.log('Successfully emitted appointment events', { id, status });
  } catch (error) {
    console.error('Error in emitAppointmentUpdated:', error);
  }
};

// Helper to add appointment update listeners
export const addAppointmentUpdateListener = (
  callback: (id: string, status: AppointmentStatus, details?: Record<string, any>) => void
) => {
  if (!callback || typeof callback !== 'function') {
    console.error('Invalid callback for appointment update listener');
    return () => {}; // Return empty cleanup function
  }
  
  const handler = (event: Event) => {
    try {
      // Validate event is a CustomEvent
      if (!(event instanceof CustomEvent)) {
        console.error('Event is not a CustomEvent', event);
        return;
      }
      
      const customEvent = event as CustomEvent;
      
      if (!customEvent || !customEvent.detail) {
        console.error('Invalid event received in appointment update listener');
        return;
      }
      
      const { id, status, ...details } = customEvent.detail;
      
      if (!id || !status) {
        console.error('Missing id or status in appointment update event', customEvent.detail);
        return;
      }
      
      // Call the callback with a try-catch to prevent errors
      try {
        callback(id, status, details);
      } catch (callbackError) {
        console.error('Error in appointment update callback:', callbackError);
      }
    } catch (error) {
      console.error('Error in appointment update listener:', error);
    }
  };
  
  // Add the event listener
  window.addEventListener('appointment-updated', handler);
  
  // Return a cleanup function
  return () => {
    try {
      window.removeEventListener('appointment-updated', handler);
    } catch (error) {
      console.error('Error removing appointment update listener:', error);
    }
  };
};

// Helper to check if appointment events are working
export const checkAppointmentEventsSystem = () => {
  try {
    const testId = `test-${Date.now()}`;
    const testListener = (id: string) => {
      console.log(`Appointment events system working: received test event for ${id}`);
    };
    
    // Add test listener
    const cleanup = addAppointmentUpdateListener(testListener);
    
    // Emit test event
    emitAppointmentUpdated(testId, 'confirmed');
    
    // Remove test listener
    cleanup();
    
    return true;
  } catch (error) {
    console.error('Appointment events system check failed:', error);
    return false;
  }
};
