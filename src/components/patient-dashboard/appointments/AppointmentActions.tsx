
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calendar } from 'lucide-react';

interface AppointmentActionsProps {
  appointmentId: string;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointmentId,
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 text-xs py-2 h-8"
        onClick={() => onConfirmAppointment?.(appointmentId)}
      >
        <Check className="h-3 w-3 mr-1" /> Confirm
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        className="flex-1 text-xs py-2 h-8"
        onClick={() => onRescheduleAppointment?.(appointmentId)}
      >
        <Calendar className="h-3 w-3 mr-1" /> Reschedule
      </Button>
    </div>
  );
};

export default AppointmentActions;
