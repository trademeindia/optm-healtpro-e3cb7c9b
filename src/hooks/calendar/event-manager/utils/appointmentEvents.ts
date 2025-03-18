
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
    window.dispatchEvent(new CustomEvent('appointment-updated', { 
      detail: { 
        id, 
        status,
        ...additionalDetails
      } 
    }));
    
    // Also dispatch a calendar-updated event to refresh calendar views
    window.dispatchEvent(new Event('calendar-updated'));
  } catch (error) {
    console.error('Error emitting appointment update event:', error);
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
  
  const handler = (event: CustomEvent) => {
    try {
      if (!event || !event.detail) {
        console.error('Invalid event received in appointment update listener');
        return;
      }
      
      const { id, status, ...details } = event.detail;
      
      if (!id || !status) {
        console.error('Missing id or status in appointment update event', event.detail);
        return;
      }
      
      callback(id, status, details);
    } catch (error) {
      console.error('Error in appointment update listener:', error);
    }
  };
  
  window.addEventListener('appointment-updated', handler as EventListener);
  
  return () => {
    window.removeEventListener('appointment-updated', handler as EventListener);
  };
};
