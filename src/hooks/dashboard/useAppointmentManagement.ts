
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { DashboardAppointment } from './types';
import { useAppointmentStatus } from '@/hooks/calendar/useAppointmentStatus';
import { AppointmentStatus } from '@/types/appointment';

export const useAppointmentManagement = (
  initialAppointments: DashboardAppointment[]
) => {
  const [appointments, setAppointments] = useState<DashboardAppointment[]>(initialAppointments);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DashboardAppointment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { handleConfirmAppointment: confirmAppointmentStatus } = useAppointmentStatus();

  // Listen for appointment updates from other parts of the application
  useEffect(() => {
    const handleAppointmentUpdated = (event: CustomEvent) => {
      const { id, status, date, time } = event.detail;
      
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id 
            ? { 
                ...appointment, 
                status: status as AppointmentStatus,
                ...(date && { date }),
                ...(time && { time })
              } 
            : appointment
        )
      );
    };

    window.addEventListener('appointment-updated', handleAppointmentUpdated as EventListener);
    
    return () => {
      window.removeEventListener('appointment-updated', handleAppointmentUpdated as EventListener);
    };
  }, []);

  // Handle appointment confirmation
  const handleConfirmAppointment = useCallback(async (id: string) => {
    if (isProcessing) return false;
    
    setIsProcessing(true);
    try {
      // Update the appointment status using the appointment status hook
      const success = await confirmAppointmentStatus(id);
      
      if (success) {
        // Update local state
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.id === id 
              ? { ...appointment, status: 'confirmed' } 
              : appointment
          )
        );
        
        // Show confirmation toast
        toast.success("Appointment Confirmed", {
          description: "Your appointment has been confirmed.",
          duration: 3000
        });
        
        // Dispatch a custom event to notify about appointment update
        window.dispatchEvent(new CustomEvent('appointment-updated', { 
          detail: { id, status: 'confirmed' } 
        }));
        
        // Dispatch a calendar-updated event
        window.dispatchEvent(new Event('calendar-updated'));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error("Failed to confirm appointment", {
        description: "Please try again later.",
        duration: 3000
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [confirmAppointmentStatus, isProcessing]);

  // Open reschedule dialog
  const openRescheduleDialog = useCallback((id: string) => {
    const appointment = appointments.find(app => app.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsRescheduleDialogOpen(true);
    }
  }, [appointments]);

  // Handle appointment rescheduling
  const handleRescheduleAppointment = useCallback((id: string, newDate: string, newTime: string) => {
    if (isProcessing) return false;
    
    setIsProcessing(true);
    try {
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id 
            ? { ...appointment, date: newDate, time: newTime, status: 'scheduled' } 
            : appointment
        )
      );
      
      // Show success toast
      toast.success("Appointment Rescheduled", {
        description: `Your appointment has been rescheduled to ${newDate} at ${newTime}.`,
        duration: 3000
      });
      
      // Dispatch a custom event to notify about appointment update
      window.dispatchEvent(new CustomEvent('appointment-updated', { 
        detail: { id, status: 'scheduled', date: newDate, time: newTime } 
      }));
      
      // Dispatch a calendar-updated event
      window.dispatchEvent(new Event('calendar-updated'));
      
      // Close dialog
      setIsRescheduleDialogOpen(false);
      setSelectedAppointment(null);
      
      return true;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error("Failed to reschedule appointment", {
        description: "Please try again later.",
        duration: 3000
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  return {
    appointments,
    selectedAppointment,
    isRescheduleDialogOpen,
    isProcessing,
    handleConfirmAppointment,
    openRescheduleDialog,
    handleRescheduleAppointment,
    closeRescheduleDialog: () => {
      setIsRescheduleDialogOpen(false);
      setSelectedAppointment(null);
    }
  };
};
