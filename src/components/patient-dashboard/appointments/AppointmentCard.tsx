
import React from 'react';
import { Calendar, Activity, Heart } from 'lucide-react';
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
  healthMetrics?: {
    heartRate?: number;
    steps?: number;
    sleep?: number;
  };
}

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  // Determine if appointment is upcoming (today or in the future)
  const isUpcoming = () => {
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    return appointment.date === 'Today' || 
           appointment.date === today || 
           new Date(appointment.date) >= now;
  };
  
  return (
    <div className="p-3 md:p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
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
      
      {/* Health metrics section - show when available */}
      {appointment.healthMetrics && (
        <div className="mb-3 p-2 bg-muted/30 rounded-md">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Health Data - Last 24 Hours</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {appointment.healthMetrics.heartRate && (
              <div className="flex items-center gap-1.5">
                <Heart className="h-3 w-3 text-red-500" />
                <span>{appointment.healthMetrics.heartRate} bpm</span>
              </div>
            )}
            {appointment.healthMetrics.steps && (
              <div className="flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-green-500" />
                <span>{appointment.healthMetrics.steps.toLocaleString()} steps</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {isUpcoming() && (
        <AppointmentActions 
          appointmentId={appointment.id}
          onConfirmAppointment={onConfirmAppointment}
          onRescheduleAppointment={onRescheduleAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentCard;
