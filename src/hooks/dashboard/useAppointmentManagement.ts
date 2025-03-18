
import { useState } from 'react';
import { toast } from 'sonner';
import { DashboardAppointment } from './types';
import { useAppointmentStatus } from '@/hooks/calendar/useAppointmentStatus';

export const useAppointmentManagement = (
  initialAppointments: DashboardAppointment[]
) => {
  const [appointments, setAppointments] = useState<DashboardAppointment[]>(initialAppointments);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DashboardAppointment | null>(null);
  
  const { handleConfirmAppointment: confirmAppointmentStatus } = useAppointmentStatus();

  // Handle appointment confirmation
  const handleConfirmAppointment = async (id: string) => {
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
        
        // In a real app, this would send a notification to the healthcare provider
        console.log(`Notification sent to healthcare provider for appointment ${id} confirmation`);
        
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
    }
  };

  // Open reschedule dialog
  const openRescheduleDialog = (id: string) => {
    const appointment = appointments.find(app => app.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsRescheduleDialogOpen(true);
    }
  };

  // Handle appointment rescheduling
  const handleRescheduleAppointment = (id: string, newDate: string, newTime: string) => {
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
      
      // Close dialog
      setIsRescheduleDialogOpen(false);
      setSelectedAppointment(null);
      
      // In a real app, this would update the appointment in the database
      // and notify the healthcare provider
      console.log(`Notification sent to healthcare provider for appointment ${id} reschedule`);
      
      return true;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error("Failed to reschedule appointment", {
        description: "Please try again later.",
        duration: 3000
      });
      return false;
    }
  };

  return {
    appointments,
    selectedAppointment,
    isRescheduleDialogOpen,
    handleConfirmAppointment,
    openRescheduleDialog,
    handleRescheduleAppointment,
    closeRescheduleDialog: () => {
      setIsRescheduleDialogOpen(false);
      setSelectedAppointment(null);
    }
  };
};
