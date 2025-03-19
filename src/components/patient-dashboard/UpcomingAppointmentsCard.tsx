
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Video } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

interface AppointmentProps {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
}

interface UpcomingAppointmentsCardProps {
  upcomingAppointments: AppointmentProps[];
  onConfirmAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string) => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  upcomingAppointments = [],
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  // Helper for formatting date strings
  const formatDate = (dateString: string): string => {
    try {
      // Attempt to parse the date
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'MMMM d, yyyy');
      }
      return dateString; // Fall back to the original string if parsing fails
    } catch (error) {
      return dateString; // Return the original string if there's an error
    }
  };
  
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming appointments</p>
            <Button variant="link" className="mt-2">
              Schedule an appointment
            </Button>
          </div>
        ) : (
          upcomingAppointments.map((appointment) => (
            <div 
              key={appointment.id}
              className="rounded-lg border border-border p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{appointment.type}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{appointment.doctor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Virtual Visit
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRescheduleAppointment(appointment.id)}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onConfirmAppointment(appointment.id)}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        
        {upcomingAppointments.length > 0 && (
          <Button variant="link" className="w-full mt-2">
            View all appointments
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;
