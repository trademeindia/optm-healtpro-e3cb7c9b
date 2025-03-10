
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/services/calendar/googleCalendarService';
import { AppointmentService } from '@/services/calendar/appointmentService';
import { GoogleCalendarService } from '@/services/calendar/googleCalendarService';

export const useAppointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  
  // Load appointments
  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const appointments = AppointmentService.getAppointments();
      console.log('Loaded appointments:', appointments);
      setAppointments(appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Failed to load appointments",
        description: "There was a problem retrieving your appointments.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if calendar is connected
  const checkCalendarConnection = () => {
    const isConnected = GoogleCalendarService.isAuthenticated();
    console.log('Calendar connected status:', isConnected);
    setCalendarConnected(isConnected);
  };
  
  // Function to handle appointment confirmation
  const handleConfirmAppointment = async (id: string) => {
    try {
      console.log('Confirming appointment:', id);
      const success = await AppointmentService.confirmAppointment(id);
      if (success) {
        toast({
          title: "Appointment Confirmed",
          description: "Your appointment has been confirmed.",
        });
        loadAppointments();
      } else {
        throw new Error("Failed to confirm appointment");
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast({
        title: "Confirmation Failed",
        description: "There was a problem confirming your appointment.",
        variant: "destructive"
      });
    }
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = async (id: string, newDate?: string, newTime?: string) => {
    try {
      console.log('Rescheduling appointment:', id, newDate, newTime);
      if (newDate && newTime) {
        // If we have a new date and time, actually reschedule the appointment
        const success = await AppointmentService.rescheduleAppointment(id, newDate, newTime);
        if (success) {
          toast({
            title: "Appointment Rescheduled",
            description: `Your appointment has been rescheduled to ${newDate} at ${newTime}.`,
          });
          await loadAppointments();
          return;
        } else {
          throw new Error("Failed to reschedule appointment");
        }
      } else {
        // This is the old behavior, kept for backward compatibility
        toast({
          title: "Reschedule Requested",
          description: "Your request to reschedule has been sent.",
        });
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast({
        title: "Rescheduling Failed",
        description: "There was a problem rescheduling your appointment.",
        variant: "destructive"
      });
      throw error; // Rethrow to let the calling component know there was an error
    }
  };
  
  // Function to connect to Google Calendar
  const handleConnectCalendar = async () => {
    try {
      console.log('Connecting to Google Calendar');
      const success = await GoogleCalendarService.authenticate();
      if (success) {
        setCalendarConnected(true);
        toast({
          title: "Connected to Google Calendar",
          description: "Your appointments will now sync with Google Calendar.",
        });
        // Reload appointments to sync with calendar
        loadAppointments();
      } else {
        throw new Error("Failed to connect to Google Calendar");
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: "Connection Failed",
        description: "There was a problem connecting to Google Calendar.",
        variant: "destructive"
      });
    }
  };

  // Function to create a new appointment
  const handleCreateAppointment = async (appointmentData: {
    type: string;
    date: string;
    time: string;
    doctorName: string;
    patientName: string;
    notes?: string;
  }) => {
    try {
      console.log('Creating new appointment:', appointmentData);
      // Create appointment object
      const newAppointment = {
        ...appointmentData,
        patientId: 'patient-123', // In a real app, this would come from the authenticated user
        status: 'scheduled' as const
      };
      
      const createdAppointment = await AppointmentService.createAppointment(newAppointment);
      
      if (createdAppointment) {
        toast({
          title: "Appointment Scheduled",
          description: `Your ${appointmentData.type} appointment has been scheduled for ${appointmentData.date} at ${appointmentData.time}.`,
        });
        
        // Reload appointments to include the new one
        loadAppointments();
        return createdAppointment;
      } else {
        throw new Error("Failed to schedule appointment");
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Scheduling Failed",
        description: "There was a problem scheduling your appointment.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    appointments,
    isLoading,
    calendarConnected,
    loadAppointments,
    checkCalendarConnection,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleConnectCalendar,
    handleCreateAppointment
  };
};
