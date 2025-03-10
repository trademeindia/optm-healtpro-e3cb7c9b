
import React from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { UpcomingAppointment } from '@/hooks/useCalendarIntegration';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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
    toast.info(`Viewing details for ${appointment.title}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-4" />
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
      <div className="text-center py-6 text-muted-foreground">
        Connect your calendar to view appointments
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No upcoming appointments scheduled
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="space-y-2">
            <h4 className="font-medium">{appointment.title}</h4>
            <p className="text-sm text-muted-foreground">{appointment.type}</p>
            
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{appointment.date}</span>
            </div>
            
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{appointment.time}</span>
            </div>
            
            {appointment.patientName && (
              <div className="flex gap-2 items-center text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{appointment.patientName}</span>
              </div>
            )}
            
            {appointment.location && (
              <div className="flex gap-2 items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{appointment.location}</span>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
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
