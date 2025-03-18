
import { AppointmentStatus } from '@/types/appointment';

// Create centralized event emitters for appointment updates
export const emitAppointmentUpdated = (
  id: string, 
  status: AppointmentStatus,
  additionalDetails?: Record<string, any>
) => {
  console.log(`Emitting appointment update event for ${id} with status ${status}`);
  
  window.dispatchEvent(new CustomEvent('appointment-updated', { 
    detail: { 
      id, 
      status,
      ...additionalDetails
    } 
  }));
  
  // Also dispatch a calendar-updated event to refresh calendar views
  window.dispatchEvent(new Event('calendar-updated'));
};

// Helper to add appointment update listeners
export const addAppointmentUpdateListener = (
  callback: (id: string, status: AppointmentStatus, details?: Record<string, any>) => void
) => {
  const handler = (event: CustomEvent) => {
    const { id, status, ...details } = event.detail;
    callback(id, status, details);
  };
  
  window.addEventListener('appointment-updated', handler as EventListener);
  
  return () => {
    window.removeEventListener('appointment-updated', handler as EventListener);
  };
};
