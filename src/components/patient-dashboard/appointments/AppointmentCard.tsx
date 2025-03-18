
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
  className
}) => {
  return (
    <div className={`p-3 md:p-4 border rounded-lg bg-card hover:shadow-md transition-shadow ${className}`}>
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-base md:text-lg truncate">{appointment.type}</h4>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {appointment.date} at {appointment.time}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {appointment.doctor}
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
