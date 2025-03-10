
import { useState, useEffect } from 'react';
import { Appointment } from '@/services/calendar/types';
import { AppointmentService } from '@/services/calendar/appointmentService';
import { GoogleCalendarService } from '@/services/calendar/googleCalendarService';
import { useToast } from '@/hooks/use-toast';

export const useAppointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // Check if calendar is connected
  const checkCalendarConnection = () => {
    const isConnected = GoogleCalendarService.isAuthenticated();
    setCalendarConnected(isConnected);
  };
  
  // Load appointments
  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const appointments = AppointmentService.getAppointments();
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
  
  // Function to handle appointment confirmation
  const handleConfirmAppointment = async (id: string) => {
    try {
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
  const handleRescheduleAppointment = async (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: "Your request to reschedule has been sent.",
    });
    // In a real app, this would open a modal to select a new date/time
  };
  
  // Function to connect to Google Calendar
  const handleConnectCalendar = async () => {
    try {
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
  
  // Initialize data
  useEffect(() => {
    loadAppointments();
    checkCalendarConnection();
  }, []);
  
  return {
    appointments,
    isLoading,
    calendarConnected,
    addDialogOpen,
    setAddDialogOpen,
    loadAppointments,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    handleConnectCalendar
  };
};
