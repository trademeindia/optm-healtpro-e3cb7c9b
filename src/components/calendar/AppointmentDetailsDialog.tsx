
import React from 'react';
import { CalendarEvent } from '@/hooks/calendar/useCalendarIntegration';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, FileText, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface AppointmentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent;
}

const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({
  open,
  onClose,
  event
}) => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  
  const handleEdit = () => {
    toast.info("Editing appointment", {
      description: "This functionality would open an edit dialog in a real app",
      duration: 3000
    });
    onClose();
  };
  
  const handleCancel = () => {
    toast.success("Appointment cancelled", {
      description: "The appointment has been cancelled",
      duration: 3000
    });
    onClose();
  };
  
  const handleReschedule = () => {
    toast.info("Rescheduling appointment", {
      description: "This functionality would open the scheduler in a real app",
      duration: 3000
    });
    onClose();
  };

  const formatTime = (date: Date) => {
    return formatDate(date, "h:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {event.isAvailable ? (
              <>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Available Slot
                </Badge>
              </>
            ) : (
              <>
                <span>{event.title}</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Booked
                </Badge>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">{formatDate(event.start, "EEEE, MMMM d, yyyy")}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">
                {formatTime(event.start)} - {formatTime(event.end)}
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round((event.end.getTime() - event.start.getTime()) / 60000)} minutes
              </div>
            </div>
          </div>
          
          {event.patientName && isDoctor && (
            <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Patient</div>
                <div className="text-sm">{event.patientName}</div>
              </div>
            </div>
          )}
          
          {event.location && (
            <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm">{event.location}</div>
              </div>
            </div>
          )}
          
          {event.description && isDoctor && (
            <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Notes</div>
                <div className="text-sm">{event.description}</div>
              </div>
            </div>
          )}
          
          <div className="border-t pt-4 mt-4">
            <div className="text-sm text-muted-foreground">
              {event.isAvailable ? (
                "This time slot is available for booking."
              ) : (
                isDoctor ? 
                  "This appointment is currently booked." : 
                  "You have an appointment scheduled at this time."
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-2">
          {event.isAvailable ? (
            <Button className="w-full" onClick={handleEdit}>
              Book This Slot
            </Button>
          ) : (
            <>
              <div className="space-x-2 flex">
                <Button variant="outline" size="icon" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={handleCancel}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={handleReschedule}>
                Reschedule
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;
