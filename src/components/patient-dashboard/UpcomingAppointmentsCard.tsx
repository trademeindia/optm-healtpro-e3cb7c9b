
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
    <div className={`glass-morphism rounded-2xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        {upcomingAppointments.map(appointment => (
          <div key={appointment.id} className="p-3 border rounded-lg bg-card">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{appointment.type}</h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.date} at {appointment.time}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.doctor}
                </p>
              </div>
              <div className="bg-primary/10 text-primary p-2 rounded-full">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex-1"
                onClick={() => handleConfirmAppointment(appointment.id)}
              >
                Confirm
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex-1"
                onClick={() => handleRescheduleAppointment(appointment.id)}
              >
                Reschedule
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="w-full mt-3 text-sm">
        View All Appointments
      </Button>
    </div>
  );
};

export default UpcomingAppointmentsCard;
