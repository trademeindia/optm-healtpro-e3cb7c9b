
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppointmentCard, type Appointment } from './appointments';
import { Calendar } from 'lucide-react';

interface UpcomingAppointmentsCardProps {
  upcomingAppointments: Appointment[];
  className?: string;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  upcomingAppointments,
  className = '',
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
    <div className={`glass-morphism rounded-2xl p-4 md:p-6 shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <div className="bg-primary/10 p-2 rounded-full">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <div className="space-y-4">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirmAppointment={handleConfirmAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
            />
          ))
        ) : (
          <div className="text-center py-6 bg-muted/30 rounded-lg">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              No upcoming appointments scheduled.
            </p>
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full mt-4 text-sm hover:bg-primary/5"
        aria-label="View all appointments"
      >
        View All Appointments
      </Button>
    </div>
  );
};

export default UpcomingAppointmentsCard;
