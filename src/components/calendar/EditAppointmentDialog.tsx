
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/hooks/calendar/types';
import AppointmentDialogForm from './appointments/AppointmentDialogForm';
import { useAppointmentDates } from '@/hooks/calendar/useAppointmentDates';
import { toast } from 'sonner';

interface EditAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (eventData: Partial<CalendarEvent>) => Promise<boolean>;
  onDelete: (eventId: string) => Promise<boolean>;
  event: CalendarEvent;
}

const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({
  open,
  onClose,
  onUpdate,
  onDelete,
  event
}) => {
  const startDate = event.start instanceof Date ? event.start : new Date(event.start);
  const endDate = event.end instanceof Date ? event.end : new Date(event.end);
  
  const {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    validateTimeRange
  } = useAppointmentDates(startDate);
  
  const [type, setType] = useState<string>(event.type || "New Appointment");
  const [patient, setPatient] = useState<string>(event.patientName || "");
  const [location, setLocation] = useState<string>(event.location || "");
  const [notes, setNotes] = useState<string>(event.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Update local state when event props change
  useEffect(() => {
    if (event) {
      const start = event.start instanceof Date ? event.start : new Date(event.start);
      const end = event.end instanceof Date ? event.end : new Date(event.end);
      
      setDate(start);
      setStartTime(formatDate(start, "h:mm a"));
      setEndTime(formatDate(end, "h:mm a"));
      setType(event.type || "New Appointment");
      setPatient(event.patientName || "");
      setLocation(event.location || "");
      setNotes(event.description || "");
      setValidationErrors({});
    }
  }, [event, setDate]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!patient.trim()) {
      errors.patient = "Patient name is required";
    }
    
    if (!type) {
      errors.type = "Appointment type is required";
    }
    
    const timeValidation = validateTimeRange();
    if (!timeValidation.isValid) {
      errors.time = timeValidation.errorMessage || "Invalid time range";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!validateForm()) {
      // Display validation errors
      Object.values(validationErrors).forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await onUpdate({
        id: event.id,
        title: `${type} - ${patient}`,
        start: date,
        end: date,
        type,
        patientName: patient,
        location,
        description: notes
      });
      
      if (!success) {
        throw new Error("Update failed");
      }
      toast.success("Appointment updated successfully", {
        description: "Your changes have been synced with Google Calendar."
      });
      onClose();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment", {
        description: "There was an error syncing with Google Calendar. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setIsDeleting(true);
      
      try {
        const success = await onDelete(event.id);
        if (success) {
          toast.success("Appointment deleted successfully", {
            description: "The appointment has been removed from Google Calendar."
          });
          onClose();
        } else {
          throw new Error("Delete failed");
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
        toast.error("Failed to delete appointment", {
          description: "There was an error syncing with Google Calendar. Please try again."
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
            validationErrors={validationErrors}
          />
          
          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row justify-between">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Appointment"}
            </Button>
            
            <div className="flex gap-2 mb-2 sm:mb-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading || isDeleting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || isDeleting}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentDialog;

// Helper function to format dates
const formatDate = (date: Date, formatString: string): string => {
  const format = require('date-fns/format');
  return format(date, formatString);
};
