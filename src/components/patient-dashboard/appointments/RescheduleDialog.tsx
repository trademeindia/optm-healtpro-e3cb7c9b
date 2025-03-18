
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DateTimePicker from './DateTimePicker';
import { Appointment } from './AppointmentCard';
import { AppointmentStatus } from '@/types/appointment';

interface RescheduleDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (appointmentId: string, newDate: Date) => Promise<boolean>;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
  appointment,
  open,
  onOpenChange,
  onReschedule,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleReschedule = async () => {
    if (!appointment) return;
    
    setIsSubmitting(true);
    try {
      const success = await onReschedule(appointment.id, selectedDate);
      if (success) {
        toast.success("Appointment Rescheduled", {
          description: `Your appointment has been rescheduled to ${selectedDate.toLocaleDateString()} at ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast.error("Failed to reschedule", {
        description: "There was an error rescheduling your appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reschedule Appointment
          </DialogTitle>
          <DialogDescription>
            Select a new date and time for your appointment.
          </DialogDescription>
        </DialogHeader>

        {appointment && (
          <div className="py-4">
            <div className="mb-4 p-3 bg-muted/50 rounded-md">
              <h4 className="font-medium">{appointment.type}</h4>
              <p className="text-sm text-muted-foreground">
                Currently scheduled for {appointment.date} at {appointment.time}
              </p>
              <p className="text-sm text-muted-foreground">
                With {appointment.doctor}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Appointment Time</label>
                <DateTimePicker 
                  date={selectedDate}
                  setDate={setSelectedDate}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReschedule} disabled={isSubmitting}>
            {isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
