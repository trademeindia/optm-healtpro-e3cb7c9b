
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarEvent } from '@/hooks/calendar/types';
import AppointmentDialogForm from './appointments/AppointmentDialogForm';
import AppointmentDialogActions from './appointments/AppointmentDialogActions';
import { useAppointmentDates } from '@/hooks/calendar/useAppointmentDates';
import { toast } from 'sonner';

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
  const {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    getAppointmentTimes,
    validateTimeRange,
    setAutoEndTime
  } = useAppointmentDates(selectedDate);
  
  const [type, setType] = useState<string>("Initial Consultation");
  const [patient, setPatient] = useState<string>("");
  const [location, setLocation] = useState<string>("Main Office - Room 101");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens or selected date changes
  useEffect(() => {
    if (open) {
      setDate(selectedDate);
      setType("Initial Consultation");
      setPatient("");
      setLocation("Main Office - Room 101");
      setNotes("");
      
      // Set default start and end times
      setStartTime("9:00 AM");
      setEndTime("9:30 AM");
    }
  }, [open, selectedDate, setDate, setStartTime, setEndTime]);

  // Update end time when start time changes
  useEffect(() => {
    if (open && startTime) {
      setAutoEndTime();
    }
  }, [startTime, open, setAutoEndTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate patient name
    if (!patient.trim()) {
      toast.error("Please enter a patient name");
      return;
    }
    
    // Validate appointment times
    const timeValidation = validateTimeRange();
    if (!timeValidation.isValid) {
      toast.error(timeValidation.errorMessage || "Invalid time range");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { start, end } = getAppointmentTimes();
      
      const eventData: Partial<CalendarEvent> = {
        title: `${type} - ${patient}`,
        start,
        end,
        type,
        patientName: patient,
        location,
        description: notes,
        isAvailable: false
      };
      
      console.log("Creating appointment with data:", eventData);
      
      const success = await onCreated(eventData);
      
      if (success) {
        onClose();
        toast.success("Appointment created successfully");
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

export default CreateAppointmentDialog;
