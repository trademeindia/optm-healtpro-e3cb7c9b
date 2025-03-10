
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppointmentCard, type Appointment } from './appointments';

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
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirmAppointment={handleConfirmAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
            />
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
