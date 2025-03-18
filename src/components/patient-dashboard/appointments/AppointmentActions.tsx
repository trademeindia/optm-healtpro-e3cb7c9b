
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { AppointmentStatus } from '@/types/appointment';

interface AppointmentActionsProps {
  appointmentId: string;
  status?: AppointmentStatus;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointmentId,
  status,
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  // Render different actions based on appointment status
  if (status === 'confirmed') {
    return (
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="flex-1 text-xs py-2 h-8"
          onClick={() => onRescheduleAppointment?.(appointmentId)}
        >
          <ArrowRight className="h-3.5 w-3.5 mr-1.5" /> Reschedule
        </Button>
      </div>
    );
  }
  
  if (status === 'cancelled' || status === 'completed') {
    return null; // No actions for cancelled or completed appointments
  }
  
  // Default: scheduled or no status (assume scheduled)
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 text-xs py-2 h-8"
        onClick={() => onConfirmAppointment?.(appointmentId)}
      >
        <Check className="h-3.5 w-3.5 mr-1.5" /> Confirm
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        className="flex-1 text-xs py-2 h-8"
        onClick={() => onRescheduleAppointment?.(appointmentId)}
      >
        <ArrowRight className="h-3.5 w-3.5 mr-1.5" /> Reschedule
      </Button>
    </div>
  );
};

export default AppointmentActions;
