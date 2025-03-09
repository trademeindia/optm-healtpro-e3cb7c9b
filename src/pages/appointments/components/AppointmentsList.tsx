
import React from 'react';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/calendar/googleCalendarService';
import { useToast } from '@/hooks/use-toast';

interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading: boolean;
  calendarConnected: boolean;
  onConfirmAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string) => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  isLoading,
  calendarConnected,
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  const { toast } = useToast();

  return (
    <>
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
                      onClick={() => onConfirmAppointment(appointment.id)}
                    >
                      Confirm
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRescheduleAppointment(appointment.id)}
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
    </>
  );
};

export default AppointmentsList;
