
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppointmentStatus } from '@/hooks/calendar/useAppointmentStatus';
import { AppointmentWithStatus } from './useAppointments';

export const usePatientAppointments = (
  initialAppointments: AppointmentWithStatus[]
) => {
  const [appointments, setAppointments] = useState<AppointmentWithStatus[]>(initialAppointments);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithStatus | null>(null);
  
  const { updateAppointmentStatus } = useAppointmentStatus();

  const handleConfirmAppointment = useCallback(async (id: string) => {
    // In a real app, this would call an API
    const success = await updateAppointmentStatus(id, 'confirmed');
    
    if (success) {
      // Update local state
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'confirmed' } 
            : appointment
        )
      );
      
      // Dispatch event for other components to react
      window.dispatchEvent(new CustomEvent('appointment-updated', { 
        detail: { id, status: 'confirmed' } 
      }));
      
      toast.success("Appointment Confirmed", {
        description: "Your appointment has been confirmed successfully.",
        duration: 3000
      });
    }
    
    return success;
  }, [updateAppointmentStatus]);

  const openRescheduleDialog = useCallback((id: string) => {
    const appointment = appointments.find(a => a.id === id) || null;
    setSelectedAppointment(appointment);
    setRescheduleDialogOpen(true);
  }, [appointments]);

  const handleRescheduleAppointment = useCallback(async (id: string, newDate: Date) => {
    try {
      // In a real app, this would call an API to reschedule
      console.log(`Rescheduling appointment ${id} to ${newDate.toISOString()}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with new date and time
      setAppointments(prev => 
        prev.map(appointment => {
          if (appointment.id === id) {
            const newDateStr = newDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            const newTimeStr = newDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit'
            });
            
            return { 
              ...appointment, 
              date: newDateStr,
              time: newTimeStr,
              status: 'scheduled' 
            };
          }
          return appointment;
        })
      );
      
      // Dispatch event for other components to react
      window.dispatchEvent(new CustomEvent('appointment-rescheduled', { 
        detail: { id, newDate } 
      }));
      
      return true;
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      return false;
    }
  }, []);

  return {
    appointments,
    selectedAppointment,
    rescheduleDialogOpen,
    setRescheduleDialogOpen,
    handleConfirmAppointment,
    openRescheduleDialog,
    handleRescheduleAppointment
  };
};

export default usePatientAppointments;
