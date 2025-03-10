
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  upcomingAppointments,
  className,
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  // Function to handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    if (onConfirmAppointment) {
      onConfirmAppointment(id);
    } else {
      toast.success("Your appointment has been confirmed.", {
        duration: 3000
      });
    }
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = (id: string) => {
    if (onRescheduleAppointment) {
      onRescheduleAppointment(id);
    } else {
      toast.success("Your request to reschedule has been sent.", {
        duration: 3000
      });
    }
  };

  return (
    <div className={`glass-morphism rounded-2xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
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
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No upcoming appointments scheduled.
          </div>
        )}
      </div>
      <Button variant="ghost" className="w-full mt-3 text-sm">
        View All Appointments
      </Button>
    </div>
  );
};

export default UpcomingAppointmentsCard;
