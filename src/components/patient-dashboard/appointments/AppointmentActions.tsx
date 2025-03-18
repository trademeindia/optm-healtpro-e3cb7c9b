
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
  // Handle confirm button click
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onConfirmAppointment) {
      onConfirmAppointment(appointmentId);
    }
  };
  
  // Handle reschedule button click  
  const handleReschedule = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRescheduleAppointment) {
      onRescheduleAppointment(appointmentId);
    }
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 text-xs py-2 h-8"
        onClick={handleConfirm}
      >
        <Check className="h-3 w-3 mr-1" /> Confirm
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        className="flex-1 text-xs py-2 h-8"
        onClick={handleReschedule}
      >
        <Calendar className="h-3 w-3 mr-1" /> Reschedule
      </Button>
    </div>
  );
};

export default AppointmentActions;
