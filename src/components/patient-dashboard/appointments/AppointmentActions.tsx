
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calendar, ActivitySquare } from 'lucide-react';
import { toast } from 'sonner';

interface AppointmentActionsProps {
  appointmentId: string;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
  onAttachHealthData?: (id: string) => void;
}

const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointmentId,
  onConfirmAppointment,
  onRescheduleAppointment,
  onAttachHealthData
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
  
  // Handle attach health data button click
  const handleAttachHealthData = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAttachHealthData) {
      onAttachHealthData(appointmentId);
    } else {
      // Default behavior if no handler is provided
      toast.success("Health data sharing preferences saved", {
        description: "Your doctor will receive your health data before the appointment",
        duration: 3000
      });
    }
  };
  
  return (
    <div className="space-y-2">
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
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs py-2 h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
        onClick={handleAttachHealthData}
      >
        <ActivitySquare className="h-3 w-3 mr-1" /> Attach Health Data
      </Button>
    </div>
  );
};

export default AppointmentActions;
