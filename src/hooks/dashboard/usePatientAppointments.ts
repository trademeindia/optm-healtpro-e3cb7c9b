
import { useState, useCallback } from 'react';
import { DashboardAppointment } from './types';
import { Appointment } from '@/components/patient-dashboard/appointments';
import { toast } from 'sonner';
import { AppointmentStatus } from '@/types/appointment';

export const usePatientAppointments = (upcomingAppointments: Appointment[]) => {
  // Convert incoming appointments to include status if not present
  const initialAppointments = upcomingAppointments.map(appointment => ({
    ...appointment,
    status: appointment.status || 'scheduled' as AppointmentStatus
  }));

  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

  // Handle confirming an appointment
  const handleConfirmAppointment = useCallback((id: string) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status: 'confirmed' as AppointmentStatus } 
          : appointment
      )
    );
    
    toast.success('Appointment confirmed', {
      description: 'Your appointment has been confirmed successfully.',
      duration: 3000
    });
  }, []);

  // Open the reschedule dialog for an appointment
  const openRescheduleDialog = useCallback((id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setRescheduleDialogOpen(true);
    }
  }, [appointments]);

  // Handle rescheduling an appointment
  const handleRescheduleAppointment = useCallback(async (
    appointmentId: string, 
    newDate: Date
  ): Promise<boolean> => {
    const formattedDate = newDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const formattedTime = newDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { 
              ...appointment, 
              date: formattedDate, 
              time: formattedTime,
              status: 'scheduled' as AppointmentStatus 
            } 
          : appointment
      )
    );
    
    setRescheduleDialogOpen(false);
    
    toast.success('Appointment rescheduled', {
      description: `Your appointment has been rescheduled to ${formattedDate} at ${formattedTime}.`,
      duration: 3000
    });
    
    return true;
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
