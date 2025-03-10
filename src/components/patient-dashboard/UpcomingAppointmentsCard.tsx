
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
            <div key={appointment.id} className="p-4 border rounded-lg bg-card">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="min-w-0"> {/* Added min-w-0 to prevent text overflow */}
                  <h4 className="font-medium text-base truncate">{appointment.type}</h4>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {appointment.date} at {appointment.time}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {appointment.doctor}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs py-2 h-8" // Adjusted height and padding
                  onClick={() => onConfirmAppointment?.(appointment.id)}
                >
                  Confirm
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex-1 text-xs py-2 h-8" // Adjusted height and padding
                  onClick={() => onRescheduleAppointment?.(appointment.id)}
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
