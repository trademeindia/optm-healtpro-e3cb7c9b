
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppointmentStatus } from '@/hooks/calendar/useAppointmentStatus';
import { DashboardAppointment } from './types';
import { AppointmentStatus } from '@/types/appointment';

export const useAppointments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<DashboardAppointment[]>([
    {
      id: '1',
      title: 'Follow-up Appointment',
      date: 'June 20, 2023',
      time: '10:30 AM',
      endTime: '11:30 AM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Follow-up',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Physical Therapy Session',
      date: 'July 5, 2023',
      time: '02:00 PM',
      endTime: '03:00 PM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Physical Therapy',
      status: 'scheduled'
    }
  ]);

  const { handleConfirmAppointment: confirmAppointmentStatus } = useAppointmentStatus();

  const handleConfirmAppointment = useCallback(async (id: string) => {
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
    }
  }, [confirmAppointmentStatus]);

  const handleRescheduleAppointment = useCallback(async (id: string, newDate?: string, newTime?: string) => {
    try {
      if (newDate && newTime) {
        // Update appointment with new date and time
        setUpcomingAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.id === id 
              ? { 
                  ...appointment, 
                  date: newDate, 
                  time: newTime,
                  // Set a default end time 1 hour later
                  endTime: newTime.includes('AM') 
                    ? newTime.replace('AM', 'AM').replace(/(\d+):(\d+)/, (_, h, m) => `${(Number(h) + 1) % 12 || 12}:${m}`) 
                    : newTime.replace('PM', 'PM').replace(/(\d+):(\d+)/, (_, h, m) => `${(Number(h) + 1) % 12 || 12}:${m}`),
                  status: 'scheduled' as AppointmentStatus 
                } 
              : appointment
          )
        );
        
        toast.success("Appointment Rescheduled", {
          description: `Your appointment has been rescheduled to ${newDate} at ${newTime}.`,
          duration: 3000
        });
      } else {
        // Simply trigger the reschedule dialog
        toast.info("Reschedule Requested", {
          description: "Opening reschedule dialog...",
          duration: 3000
        });
      }
      
      // Dispatch events to update all views
      window.dispatchEvent(new CustomEvent('appointment-updated', { 
        detail: { id, status: 'scheduled', date: newDate, time: newTime } 
      }));
      
      // Dispatch a calendar-updated event
      window.dispatchEvent(new Event('calendar-updated'));
      
      return true;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setError(error instanceof Error ? error : new Error('Failed to reschedule appointment'));
      toast.error("Failed to reschedule appointment", {
        description: "Please try again later.",
        duration: 3000
      });
      return false;
    }
  }, []);

  return {
    upcomingAppointments,
    isLoading,
    error,
    handleConfirmAppointment,
    handleRescheduleAppointment
  };
};
