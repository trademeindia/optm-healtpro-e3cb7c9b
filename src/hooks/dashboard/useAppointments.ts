
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DashboardAppointment } from './types';
import { AppointmentStatus } from '@/types/appointment';
import { useAppointmentStatus } from '@/hooks/calendar/useAppointmentStatus';

export interface AppointmentWithStatus extends DashboardAppointment {
  status?: AppointmentStatus;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentWithStatus[]>([
    {
      id: '1',
      date: 'June 20, 2023',
      time: '10:30 AM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Follow-up',
      status: 'scheduled'
    },
    {
      id: '2',
      date: 'July 5, 2023',
      time: '02:00 PM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Physical Therapy',
      status: 'scheduled'
    }
  ]);

  const { handleConfirmAppointment, handleCancelAppointment } = useAppointmentStatus();

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status } 
          : appointment
      )
    );
  }, []);

  const handleConfirm = useCallback(async (id: string) => {
    const success = await handleConfirmAppointment(id);
    if (success) {
      updateAppointmentStatus(id, 'confirmed');
      toast.success("Appointment Confirmed", {
        description: "Your appointment has been confirmed.",
        duration: 3000
      });
    }
    return success;
  }, [handleConfirmAppointment, updateAppointmentStatus]);

  const handleRescheduleAppointment = useCallback((id: string) => {
    toast.info("Reschedule Requested", {
      description: "Your request to reschedule has been sent.",
      duration: 3000
    });
    // In a real app, this would navigate to a reschedule page or open a dialog
  }, []);

  // Listen for global appointment update events
  useEffect(() => {
    const handleAppointmentUpdated = (event: CustomEvent) => {
      const { id, status } = event.detail;
      if (id && status) {
        updateAppointmentStatus(id, status);
      }
    };

    window.addEventListener('appointment-updated', 
      handleAppointmentUpdated as EventListener);
    
    return () => {
      window.removeEventListener('appointment-updated', 
        handleAppointmentUpdated as EventListener);
    };
  }, [updateAppointmentStatus]);

  return {
    upcomingAppointments: appointments,
    handleConfirmAppointment: handleConfirm,
    handleRescheduleAppointment,
    updateAppointmentStatus
  };
};

export default useAppointments;
