
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

export const formatAppointments = (appointments: Appointment[]) => {
  return appointments.map(appointment => ({
    id: appointment.id,
    date: appointment.date,
    time: appointment.time,
    doctor: appointment.doctorName,
    type: appointment.type
  }));
};
