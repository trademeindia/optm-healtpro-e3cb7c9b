
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Appointment } from '@/services/calendar/types';
import { AppointmentService } from '@/services/calendar/appointmentService';
import { initializeCalendarService } from '@/services/calendar/calendarInit';
import { GoogleCalendarService } from '@/services/calendar/googleCalendarService';

const CalendarTab: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  
  useEffect(() => {
    // Initialize calendar service
    initializeCalendarService();
    
    // Load appointments
    loadAppointments();
    
    // Check if calendar is connected
    const isConnected = GoogleCalendarService.isAuthenticated();
    setCalendarConnected(isConnected);
  }, []);
  
  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const appointments = AppointmentService.getAppointments();
      setAppointments(appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const connectCalendar = async () => {
    try {
      const success = await GoogleCalendarService.authenticate();
      if (success) {
        setCalendarConnected(true);
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
    }
  };
  
  // Function to get appointments for the selected date
  const getAppointmentsForDate = (date: Date) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
    
    return appointments.filter(appointment => appointment.date === formattedDate);
  };
  
  const selectedDayAppointments = getAppointmentsForDate(date);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Appointment Calendar</h2>
          <p className="text-muted-foreground mb-2">
            Manage and schedule patient appointments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadAppointments} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          
          {!calendarConnected && (
            <Button variant="outline" size="sm" onClick={connectCalendar}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Connect Google Calendar
            </Button>
          )}
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="md:col-span-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border shadow-sm p-2 bg-white"
          />
          
          {calendarConnected && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/10 text-sm text-green-800 dark:text-green-300 rounded flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Synced with Google Calendar
            </div>
          )}
        </div>
        
        <div className="md:col-span-5">
          <div className="border rounded-md p-4">
            <h3 className="font-medium text-lg mb-2">
              {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedDayAppointments.length > 0 ? (
              <div className="space-y-2">
                {selectedDayAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{appointment.time} - {appointment.type}</p>
                        <p className="text-sm text-muted-foreground">Patient: {appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">Doctor: {appointment.doctorName}</p>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-dashed border-2 rounded-md">
                <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No appointments scheduled for this day</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;
