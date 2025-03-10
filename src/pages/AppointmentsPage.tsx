
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useToast } from '@/hooks/use-toast';
import AppointmentsDashboard from '@/components/dashboard/AppointmentsDashboard';
import { AppointmentService } from '@/services/calendar/appointmentService';
import { Appointment } from '@/services/calendar/googleCalendarService';
import { GoogleCalendarService } from '@/services/calendar/googleCalendarService';

const AppointmentsPage: React.FC = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  
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
  
  // Check if calendar is connected
  const checkCalendarConnection = () => {
    const isConnected = GoogleCalendarService.isAuthenticated();
    setCalendarConnected(isConnected);
  };
  
  useEffect(() => {
    loadAppointments();
    checkCalendarConnection();
  }, []);
  
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
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Your Appointments</h1>
                <p className="text-sm text-muted-foreground">
                  View and manage your upcoming appointments
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={loadAppointments} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh
                </Button>
                
                {!calendarConnected && (
                  <Button variant="outline" size="sm" onClick={handleConnectCalendar}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Connect Calendar
                  </Button>
                )}
                
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <AppointmentsDashboard 
              unreadMessages={3}
              nextAppointment={appointments.length > 0 ? {
                date: appointments[0].date,
                time: appointments[0].time,
                doctor: appointments[0].doctorName,
                type: appointments[0].type
              } : undefined}
            />
            
            <h3 className="text-xl font-semibold mt-10 mb-4">Scheduled Appointments</h3>
            <div className="glass-morphism rounded-2xl p-6">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center p-6">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground">Loading appointments...</p>
                  </div>
                ) : appointments.length > 0 ? (
                  appointments.map(appointment => (
                    <div key={appointment.id} className="p-4 border rounded-lg bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-base">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {appointment.date} at {appointment.time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctorName}
                          </p>
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              appointment.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300'
                            }`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                            {appointment.googleEventId && (
                              <span className="text-xs ml-2 text-muted-foreground">
                                Synced with Calendar
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end md:self-center">
                        {appointment.status !== 'confirmed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleConfirmAppointment(appointment.id)}
                          >
                            Confirm
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRescheduleAppointment(appointment.id)}
                        >
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">No upcoming appointments scheduled</p>
                    <Button className="mt-4" onClick={() => toast({ title: "New Appointment", description: "Creating new appointment" })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Your First Appointment
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {calendarConnected && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md text-sm text-green-800 dark:text-green-300 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Your appointments are being synced with Google Calendar
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentsPage;
