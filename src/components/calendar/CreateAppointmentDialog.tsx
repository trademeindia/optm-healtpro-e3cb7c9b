
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarEvent } from '@/hooks/calendar/types';
import AppointmentDialogForm from './appointments/AppointmentDialogForm';
import AppointmentDialogActions from './appointments/AppointmentDialogActions';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const eventData: Partial<CalendarEvent> = {
        title: `${type} - ${patient}`,
        start: date,
        end: date,
        type,
        patientName: patient,
        location,
        description: notes,
        isAvailable: false
      };
      
      await onCreated(eventData);
    } catch (error) {
      console.error("Error creating appointment:", error);
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
