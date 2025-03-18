
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    date: string;
    time: string;
    doctor: string;
    type: string;
  };
  onReschedule: (id: string, newDate: string, newTime: string) => void;
}

// Generate time slots from 8 AM to 5 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 17; hour++) {
    const amPm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour <= 12 ? hour : hour - 12;
    
    slots.push(`${displayHour}:00 ${amPm}`);
    slots.push(`${displayHour}:30 ${amPm}`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
  isOpen,
  onClose,
  appointment,
  onReschedule
}) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(today, 1));
  const [selectedTime, setSelectedTime] = useState<string>(timeSlots[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReschedule = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setIsSubmitting(true);

    // Format the date for display (e.g., "June 20, 2023")
    const formattedDate = format(selectedDate, 'MMMM d, yyyy');

    try {
      onReschedule(appointment.id, formattedDate, selectedTime);
      onClose();
    } catch (error) {
      console.error('Error during reschedule:', error);
      toast.error("Something went wrong", {
        description: "Failed to reschedule appointment. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Reschedule Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Current Appointment</label>
            <div className="p-3 rounded-md bg-muted/50">
              <p className="font-medium">{appointment.type}</p>
              <p className="text-sm text-muted-foreground">
                {appointment.date} at {appointment.time}
              </p>
              <p className="text-sm text-muted-foreground">
                {appointment.doctor}
              </p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select New Date</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => {
                // Disable past dates and weekends
                const today = startOfDay(new Date());
                const day = date.getDay();
                return isBefore(date, today) || day === 0 || day === 6;
              }}
              initialFocus
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select New Time</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleReschedule} disabled={isSubmitting}>
            {isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
