
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface RescheduleModalProps {
  appointmentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (id: string, date: string, time: string) => Promise<void>;
}

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM'
];

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointmentId,
  isOpen,
  onClose,
  onReschedule
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>(timeSlots[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!appointmentId || !date) return;
    
    setIsSubmitting(true);
    try {
      const formattedDate = format(date, 'MMMM d, yyyy');
      await onReschedule(appointmentId, formattedDate, time);
      onClose();
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Select Date
            </div>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className={cn("rounded-md border w-full", "p-3 pointer-events-auto")}
            />
          </div>
          
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Select Time
            </div>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!date || isSubmitting}>
            {isSubmitting ? (
              <>Rescheduling...</>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirm New Time
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
