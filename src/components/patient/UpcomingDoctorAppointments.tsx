
import React from 'react';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  isConfirmed?: boolean;
  isSyncedToCalendar?: boolean;
}

interface UpcomingDoctorAppointmentsProps {
  appointments: Appointment[];
  className?: string;
  onViewAll?: () => void;
  onConfirm?: (id: string) => void;
  onReschedule?: (id: string) => void;
}

const UpcomingDoctorAppointments: React.FC<UpcomingDoctorAppointmentsProps> = ({
  appointments,
  className,
  onViewAll,
  onConfirm,
  onReschedule,
}) => {
  const { toast } = useToast();

  const handleConfirm = (id: string) => {
    if (onConfirm) {
      onConfirm(id);
    } else {
      toast({
        title: "Appointment Confirmed",
        description: "Your appointment has been confirmed.",
      });
    }
  };

  const handleReschedule = (id: string) => {
    if (onReschedule) {
      onReschedule(id);
    } else {
      toast({
        title: "Reschedule Requested",
        description: "Your request to reschedule has been sent.",
      });
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Upcoming Doctor Appointments
        </CardTitle>
        <CardDescription>
          Your scheduled appointments with healthcare providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No upcoming appointments</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="p-3 border rounded-lg bg-card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{appointment.type}</h4>
                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{appointment.doctor}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {appointment.time}
                      </div>
                    </div>
                  </div>
                  {appointment.isSyncedToCalendar && (
                    <div className="text-xs flex items-center text-green-600">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Synced
                    </div>
                  )}
                </div>
                {!appointment.isConfirmed && (
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs flex-1"
                      onClick={() => handleConfirm(appointment.id)}
                    >
                      Confirm
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs flex-1"
                      onClick={() => handleReschedule(appointment.id)}
                    >
                      Reschedule
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {appointments.length > 0 && (
          <Button variant="ghost" className="w-full mt-4" onClick={onViewAll}>
            View All Appointments
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDoctorAppointments;
