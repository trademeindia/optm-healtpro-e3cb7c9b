
import React from 'react';
import { Calendar, Clock, User, MapPin, AlertCircle } from 'lucide-react';
import { UpcomingAppointment } from '@/hooks/calendar/useCalendarIntegration';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AppointmentStatusIndicator } from './AppointmentStatusIndicator';

interface AppointmentsListProps {
  appointments: UpcomingAppointment[];
  isLoading: boolean;
  isAuthorized: boolean;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ 
  appointments,
  isLoading,
  isAuthorized
}) => {
  const handleViewDetails = (appointment: UpcomingAppointment) => {
    if (!appointment) return;
    toast.info(`Viewing details for ${appointment.title}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-3">
        <div className="bg-muted/20 p-3 rounded-full">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <p>Connect your calendar to view appointments</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-full">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <p>No upcoming appointments scheduled</p>
        <p className="text-xs text-muted-foreground mt-1">Click "New Appointment" to create one</p>
      </div>
    );
  }

  // Sort appointments by date/time (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-4">
      {sortedAppointments.map((appointment) => (
        <div 
          key={appointment.id} 
          className="border rounded-lg p-4 hover:bg-muted/5 transition-colors duration-200 hover:shadow-sm"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-foreground break-words">{appointment.title}</h4>
              {appointment.status && (
                <AppointmentStatusIndicator status={appointment.status} />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">{appointment.type}</p>
            
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-2 items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="truncate">{appointment.date}</span>
              </div>
              
              <div className="flex gap-2 items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="truncate">{appointment.time}</span>
              </div>
              
              {appointment.patientName && (
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="truncate">{appointment.patientName}</span>
                </div>
              )}
              
              {appointment.location && (
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="truncate">{appointment.location}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-primary/10 hover:text-primary"
                onClick={() => handleViewDetails(appointment)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentsList;
