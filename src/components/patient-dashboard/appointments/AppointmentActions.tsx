
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calendar } from 'lucide-react';
import { AppointmentStatus } from '@/types/appointment';

interface AppointmentActionsProps {
  appointmentId: string;
  status?: AppointmentStatus;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
  className?: string;
}

const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointmentId,
  status,
  onConfirmAppointment,
  onRescheduleAppointment,
  className
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirmAppointment) return;
    
    setIsConfirming(true);
    try {
      await onConfirmAppointment(appointmentId);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReschedule = async () => {
    if (!onRescheduleAppointment) return;
    
    setIsRescheduling(true);
    try {
      await onRescheduleAppointment(appointmentId);
    } finally {
      setIsRescheduling(false);
    }
  };

  // If the appointment is already confirmed, don't show the confirm button
  if (status === 'confirmed') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex-1 text-xs py-2 h-8"
          onClick={handleReschedule}
          disabled={isRescheduling}
        >
          <Calendar className="h-3 w-3 mr-1" /> 
          {isRescheduling ? "Processing..." : "Reschedule"}
        </Button>
      </div>
    );
  }

  // For scheduled or default status
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 text-xs py-2 h-8"
        onClick={handleConfirm}
        disabled={isConfirming}
      >
        <Check className="h-3 w-3 mr-1" /> 
        {isConfirming ? "Processing..." : "Confirm"}
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        className="flex-1 text-xs py-2 h-8"
        onClick={handleReschedule}
        disabled={isRescheduling}
      >
        <Calendar className="h-3 w-3 mr-1" /> 
        {isRescheduling ? "Processing..." : "Reschedule"}
      </Button>
    </div>
  );
};

export default AppointmentActions;
