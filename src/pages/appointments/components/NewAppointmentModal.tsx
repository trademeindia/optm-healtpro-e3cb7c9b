
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Check, X, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Appointment } from '@/services/calendar/types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (appointmentData: {
    type: string;
    date: string;
    time: string;
    doctorName: string;
    patientName: string;
    notes?: string;
  }) => Promise<void>;
}

const appointmentTypes = [
  'Check-up',
  'Consultation',
  'Follow-up',
  'Physical Therapy',
  'Treatment',
  'Other'
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM'
];

const doctors = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Rodriguez',
  'Dr. David Kim'
];

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSchedule
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>(timeSlots[0]);
  const [type, setType] = useState<string>(appointmentTypes[0]);
  const [doctorName, setDoctorName] = useState<string>(doctors[0]);
  const [patientName, setPatientName] = useState<string>('John Doe');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date) return;
    
    setIsSubmitting(true);
    try {
      const formattedDate = format(date, 'MMMM d, yyyy');
      await onSchedule({
        type,
        date: formattedDate,
        time,
        doctorName,
        patientName,
        notes
      });
      // Reset form
      setDate(new Date());
      setTime(timeSlots[0]);
      setType(appointmentTypes[0]);
      setDoctorName(doctors[0]);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select value={doctorName} onValueChange={setDoctorName}>
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
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
          
          <div className="grid grid-cols-1 gap-2">
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
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Any additional information"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!date || isSubmitting}>
            {isSubmitting ? (
              <>Scheduling...</>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Schedule Appointment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentModal;
