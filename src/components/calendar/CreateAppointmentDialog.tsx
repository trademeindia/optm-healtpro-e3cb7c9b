
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarEvent } from '@/hooks/calendar/types';
import AppointmentDialogForm from './appointments/AppointmentDialogForm';
import AppointmentDialogActions from './appointments/AppointmentDialogActions';
import { parse, set } from 'date-fns';

interface CreateAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (eventData: Partial<CalendarEvent>) => Promise<boolean>;
  selectedDate: Date;
}

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  open,
  onClose,
  onCreated,
  selectedDate
}) => {
  const [date, setDate] = useState<Date>(selectedDate);
  const [startTime, setStartTime] = useState<string>("9:00 AM");
  const [endTime, setEndTime] = useState<string>("9:30 AM");
  const [type, setType] = useState<string>("Initial Consultation");
  const [patient, setPatient] = useState<string>("");
  const [location, setLocation] = useState<string>("Main Office - Room 101");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when opening dialog with a new selected date
  useEffect(() => {
    if (open) {
      setDate(selectedDate);
      setPatient(""); // Reset patient name when reopening
      setNotes(""); // Reset notes when reopening
    }
  }, [open, selectedDate]);

  const parseTimeToDate = (baseDate: Date, timeString: string): Date => {
    try {
      // Parse the time string to get hours and minutes
      const timeFormat = timeString.includes('AM') || timeString.includes('PM') ? 'h:mm a' : 'HH:mm';
      const parsed = parse(timeString, timeFormat, new Date());
      
      // Create a new date with the base date's year, month, day and the parsed time
      return set(new Date(baseDate), {
        hours: parsed.getHours(),
        minutes: parsed.getMinutes(),
        seconds: 0,
        milliseconds: 0
      });
    } catch (error) {
      console.error("Error parsing time:", error, timeString);
      // Return a default time if parsing fails
      return new Date(baseDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patient.trim()) {
      toast.error("Please enter a patient name");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Creating appointment with date:", date);
      console.log("Time values:", { startTime, endTime });
      
      // Convert time strings to Date objects using the selected date as the base
      const startDateTime = parseTimeToDate(date, startTime);
      const endDateTime = parseTimeToDate(date, endTime);
      
      console.log("Parsed dates:", { 
        startDateTime: startDateTime.toISOString(), 
        endDateTime: endDateTime.toISOString() 
      });
      
      const eventData: Partial<CalendarEvent> = {
        title: `${type} - ${patient}`,
        start: startDateTime,
        end: endDateTime,
        type,
        patientName: patient,
        location,
        description: notes,
        isAvailable: false
      };
      
      console.log("Creating appointment with data:", eventData);
      const success = await onCreated(eventData);
      
      if (success) {
        console.log("Appointment created successfully");
        onClose();
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment", {
        description: "There was an error creating your appointment. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <AppointmentDialogForm
            date={date}
            setDate={setDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            type={type}
            setType={setType}
            patient={patient}
            setPatient={setPatient}
            location={location}
            setLocation={setLocation}
            notes={notes}
            setNotes={setNotes}
          />
          
          <AppointmentDialogActions
            isLoading={isLoading}
            onClose={onClose}
            submitLabel="Create Appointment"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Missing import for toast
import { toast } from 'sonner';

export default CreateAppointmentDialog;
