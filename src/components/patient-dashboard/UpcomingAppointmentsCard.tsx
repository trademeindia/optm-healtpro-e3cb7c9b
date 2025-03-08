
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
}

interface UpcomingAppointmentsCardProps {
  upcomingAppointments: Appointment[];
  className?: string;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  upcomingAppointments,
  className
}) => {
  const { toast } = useToast();

  // Function to handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    toast({
      title: "Appointment Confirmed",
      description: "Your appointment has been confirmed.",
    });
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: "Your request to reschedule has been sent.",
    });
  };

  return (
    <div className={`glass-morphism rounded-2xl p-4 md:p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <Button variant="ghost" size="sm" className="text-primary text-xs md:text-sm">
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
            <div key={appointment.id} className="p-2 md:p-3 border rounded-lg bg-card hover:bg-secondary/40 transition-colors duration-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-xs md:text-sm font-medium">{appointment.type}</h4>
                  <p className="text-xs text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.doctor}
                  </p>
                </div>
                <div className="bg-primary/10 text-primary p-1.5 md:p-2 rounded-full">
                  <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs flex-1 h-7 md:h-8"
                  onClick={() => handleConfirmAppointment(appointment.id)}
                >
                  Confirm
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex-1 h-7 md:h-8"
                  onClick={() => handleRescheduleAppointment(appointment.id)}
                >
                  Reschedule
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
          </div>
        )}
      </div>
      {upcomingAppointments.length > 0 && (
        <Button variant="ghost" className="w-full mt-3 text-xs md:text-sm" size="sm">
          Schedule New Appointment
        </Button>
      )}
    </div>
  );
};

export default UpcomingAppointmentsCard;
