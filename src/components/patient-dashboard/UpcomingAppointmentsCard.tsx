
import React, { useEffect, useState } from 'react';
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
  const [appointments, setAppointments] = useState<Appointment[]>(upcomingAppointments || []);

  // Update appointments when props change
  useEffect(() => {
    setAppointments(upcomingAppointments || []);
  }, [upcomingAppointments]);

  // Listen for appointment changes
  useEffect(() => {
    const handleAppointmentCreated = () => {
      console.log("Appointment created event detected in UpcomingAppointmentsCard");
      // We don't need to do anything here because the parent component will update the props
    };

    const handleCalendarUpdated = () => {
      console.log("Calendar updated event detected in UpcomingAppointmentsCard");
      // We don't need to do anything here because the parent component will update the props
    };

    window.addEventListener('appointment-created', handleAppointmentCreated);
    window.addEventListener('calendar-updated', handleCalendarUpdated);
    window.addEventListener('calendar-data-updated', handleCalendarUpdated);

    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
      window.removeEventListener('calendar-updated', handleCalendarUpdated);
      window.removeEventListener('calendar-data-updated', handleCalendarUpdated);
    };
  }, []);

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
    <div className={`glass-morphism rounded-2xl p-4 md:p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map(appointment => (
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
      <Button 
        variant="ghost" 
        className="w-full mt-3 text-sm"
        aria-label="View all appointments"
      >
        View All Appointments
      </Button>
    </div>
  );
};

export default UpcomingAppointmentsCard;
