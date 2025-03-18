
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppointmentCard, type Appointment } from './appointments';
import { DashboardAppointment } from '@/hooks/dashboard/types';
import { UpcomingAppointment } from '@/hooks/calendar/types';

interface UpcomingAppointmentsCardProps {
  upcomingAppointments: UpcomingAppointment[] | DashboardAppointment[];
  className?: string;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

// Adapter function to convert different appointment types to the Appointment type
const adaptAppointment = (appt: UpcomingAppointment | DashboardAppointment): Appointment => {
  if ('doctor' in appt) {
    // It's a DashboardAppointment
    return {
      id: appt.id,
      date: appt.date,
      time: appt.time,
      doctor: appt.doctor,
      type: appt.type,
      status: appt.status
    };
  } else {
    // It's an UpcomingAppointment
    return {
      id: appt.id,
      date: typeof appt.date === 'string' ? appt.date : new Date(appt.date).toLocaleDateString(),
      time: appt.time,
      doctor: 'doctorName' in appt && appt.doctorName ? appt.doctorName : 'Your Doctor',
      type: appt.type || appt.title || 'Appointment', // Ensure there's always a valid string here
      status: appt.status || 'scheduled'
    };
  }
};

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

  // Convert the appointments to the required format
  const adaptedAppointments = upcomingAppointments.map(adaptAppointment);

  return (
    <div className={`glass-morphism rounded-2xl p-4 md:p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        {adaptedAppointments.length > 0 ? (
          adaptedAppointments.map(appointment => (
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
