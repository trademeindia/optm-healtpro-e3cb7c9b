
import React from 'react';
import { Calendar } from 'lucide-react';
import { AppointmentStatus } from '@/types/appointment';
import AppointmentStatusIndicator from '@/components/calendar/AppointmentStatusIndicator';
import AppointmentActions from './AppointmentActions';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status?: AppointmentStatus;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
  className?: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onConfirmAppointment,
  onRescheduleAppointment,
  className = ''
}) => {
  // Safety check for null/undefined appointment
  if (!appointment || !appointment.id) {
    console.error('Invalid appointment passed to AppointmentCard:', appointment);
    return (
      <div className={`p-3 md:p-4 border rounded-lg bg-card hover:shadow-md transition-shadow ${className}`}>
        <p className="text-muted-foreground text-sm">No appointment data available</p>
      </div>
    );
  }

  // Get default type if not available
  const appointmentType = appointment.type || 'Appointment';
  // Get default date and time if not available
  const appointmentDate = appointment.date || 'No date';
  const appointmentTime = appointment.time || 'No time';
  // Get default doctor name if not available
  const doctorName = appointment.doctor || 'No doctor assigned';

  return (
    <div className={`p-3 md:p-4 border rounded-lg bg-card hover:shadow-md transition-shadow ${className}`}>
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-base md:text-lg truncate">{appointmentType}</h4>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {appointmentDate} at {appointmentTime}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {doctorName}
          </p>
        </div>
        <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
          <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </div>
      </div>

      {appointment.status && (
        <div className="mb-3">
          <AppointmentStatusIndicator status={appointment.status} />
        </div>
      )}
      
      <AppointmentActions 
        appointmentId={appointment.id}
        status={appointment.status}
        onConfirmAppointment={onConfirmAppointment}
        onRescheduleAppointment={onRescheduleAppointment}
      />
    </div>
  );
};

export default AppointmentCard;
