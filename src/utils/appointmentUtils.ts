
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/services/calendar/types';

/**
 * Utility functions for handling appointments
 */

export const useAppointmentHandlers = () => {
  const { toast } = useToast();

  // Function to handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    toast({
      title: "Appointment Confirmed",
      description: "Your appointment has been confirmed.",
    });
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: "Your request to reschedule has been sent.",
    });
  };

  return {
    handleConfirmAppointment,
    handleRescheduleAppointment
  };
};

/**
 * Format appointments for UI consumption
 * Returns a properly typed array for UI components
 */
export const formatAppointments = (appointments: Appointment[]): Appointment[] => {
  // Return the appointments directly as they already match the Appointment type
  return appointments;
};
