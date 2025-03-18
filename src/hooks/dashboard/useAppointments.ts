
import { useState } from 'react';
import { toast } from 'sonner';
import { useAppointmentStatus } from '@/hooks/calendar/useAppointmentStatus';
import { DashboardAppointment } from './types';
import { AppointmentStatus } from '@/types/appointment';

export const useAppointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<DashboardAppointment[]>([
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

  const { handleConfirmAppointment: confirmAppointmentStatus } = useAppointmentStatus();

  const handleConfirmAppointment = async (id: string) => {
    try {
      // Update the appointment status using the appointment status hook
      const success = await confirmAppointmentStatus(id);
      
      if (success) {
        // Update local state
        setUpcomingAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.id === id 
              ? { ...appointment, status: 'confirmed' as AppointmentStatus } 
              : appointment
          )
        );
        
        // Show confirmation toast
        toast.success("Appointment Confirmed", {
          description: "Your appointment has been confirmed.",
          duration: 3000
        });
        
        // In a real app, this would notify the healthcare provider
        console.log(`Sending notification to healthcare provider for appointment ${id}`);
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error("Failed to confirm appointment", {
        description: "Please try again later.",
        duration: 3000
      });
    }
  };

  const handleRescheduleAppointment = async (id: string) => {
    try {
      // In a real app, this would open a reschedule dialog
      // For now, we'll just show a toast
      toast.info("Reschedule Requested", {
        description: "Your request to reschedule has been sent.",
        duration: 3000
      });
      
      // In a real app, this would update the appointment in the database
      // and notify the healthcare provider
      console.log(`Sending reschedule notification to healthcare provider for appointment ${id}`);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error("Failed to request reschedule", {
        description: "Please try again later.",
        duration: 3000
      });
    }
  };

  return {
    upcomingAppointments,
    handleConfirmAppointment,
    handleRescheduleAppointment
  };
};
