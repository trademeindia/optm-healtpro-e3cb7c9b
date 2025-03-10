
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate, cn } from '@/lib/utils';
import { CalendarEvent } from '@/hooks/calendar/types';
import { toast } from 'sonner';

interface EditAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (eventId: string, eventData: Partial<CalendarEvent>) => Promise<boolean>;
  onDelete: (eventId: string) => Promise<boolean>;
  event: CalendarEvent;
}

const appointmentTypes = [
  "Initial Consultation",
  "Follow-up",
  "Physical Therapy",
  "Examination",
  "Treatment Review",
  "Urgent Care"
];

const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
];

const locations = [
  "Main Office - Room 101",
  "Virtual Meeting",
  "Clinic A - Floor 2",
  "Rehab Center",
  "West Wing - Suite 305"
];

const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({
  open,
  onClose,
  onUpdate,
  onDelete,
  event
}) => {
  const startDate = event.start instanceof Date ? event.start : new Date(event.start);
  const endDate = event.end instanceof Date ? event.end : new Date(event.end);
  
  const [date, setDate] = useState<Date>(startDate);
  const [startTime, setStartTime] = useState<string>(formatDate(startDate, "h:mm a"));
  const [endTime, setEndTime] = useState<string>(formatDate(endDate, "h:mm a"));
  const [type, setType] = useState<string>(event.type || appointmentTypes[0]);
  const [patient, setPatient] = useState<string>(event.patientName || "");
  const [location, setLocation] = useState<string>(event.location || locations[0]);
  const [notes, setNotes] = useState<string>(event.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update local state when event props change
  useEffect(() => {
    if (event) {
      const start = event.start instanceof Date ? event.start : new Date(event.start);
      const end = event.end instanceof Date ? event.end : new Date(event.end);
      
      setDate(start);
      setStartTime(formatDate(start, "h:mm a"));
      setEndTime(formatDate(end, "h:mm a"));
      setType(event.type || appointmentTypes[0]);
      setPatient(event.patientName || "");
      setLocation(event.location || locations[0]);
      setNotes(event.description || "");
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await onUpdate(event.id, {
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
    } catch (error) {
      console.error("Error updating appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setIsDeleting(true);
      
      try {
        await onDelete(event.id);
      } catch (error) {
        console.error("Error deleting appointment:", error);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date, "MMMM d, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="start-time">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="end-time">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patient">Patient Name</Label>
              <Input 
                id="patient" 
                placeholder="Enter patient name" 
                value={patient} 
                onChange={(e) => setPatient(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Add any additional notes here..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
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
