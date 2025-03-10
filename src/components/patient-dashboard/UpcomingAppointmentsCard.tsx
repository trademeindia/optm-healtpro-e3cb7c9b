
import React, { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AppointmentService } from '@/services/calendar/appointmentService';
import { Appointment } from '@/services/calendar/googleCalendarService';

interface UpcomingAppointmentsCardProps {
  upcomingAppointments: Appointment[];
  className?: string;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
  onLoadAppointments?: () => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  upcomingAppointments,
  className,
  onConfirmAppointment,
  onRescheduleAppointment,
  onLoadAppointments
}) => {
  const { toast } = useToast();
  const [processingAppointments, setProcessingAppointments] = useState<Record<string, boolean>>({});

  // Function to handle appointment confirmation
  const handleConfirmAppointment = async (id: string) => {
    setProcessingAppointments(prev => ({ ...prev, [id]: true }));
    
    try {
      if (onConfirmAppointment) {
        onConfirmAppointment(id);
      } else {
        const success = await AppointmentService.confirmAppointment(id);
        if (success) {
          toast({
            title: "Appointment Confirmed",
            description: "Your appointment has been confirmed and added to your calendar.",
          });
          
          // Refresh appointments if needed
          if (onLoadAppointments) {
            onLoadAppointments();
          }
        } else {
          throw new Error("Failed to confirm appointment");
        }
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Confirmation Failed",
        description: "There was a problem confirming your appointment.",
        variant: "destructive",
      });
    } finally {
      setProcessingAppointments(prev => ({ ...prev, [id]: false }));
    }
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = async (id: string) => {
    setProcessingAppointments(prev => ({ ...prev, [id]: true }));
    
    try {
      if (onRescheduleAppointment) {
        onRescheduleAppointment(id);
      } else {
        toast({
          title: "Reschedule Requested",
          description: "Your request to reschedule has been sent.",
        });
        
        // In a real implementation, this would open a reschedule dialog
        // For now, we'll just simulate it
        
        // Refresh appointments if needed
        if (onLoadAppointments) {
          onLoadAppointments();
        }
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast({
        title: "Reschedule Failed",
        description: "There was a problem requesting to reschedule your appointment.",
        variant: "destructive",
      });
    } finally {
      setProcessingAppointments(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className={`glass-morphism rounded-2xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
            <div key={appointment.id} className="p-3 border rounded-lg bg-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{appointment.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.doctorName}
                  </p>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    {appointment.googleEventId && (
                      <span className="text-xs ml-2 text-muted-foreground">
                        Synced with Calendar
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <div className="flex gap-2">
                {appointment.status !== 'confirmed' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs flex-1"
                    onClick={() => handleConfirmAppointment(appointment.id)}
                    disabled={processingAppointments[appointment.id]}
                  >
                    {processingAppointments[appointment.id] ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : null}
                    Confirm
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex-1"
                  onClick={() => handleRescheduleAppointment(appointment.id)}
                  disabled={processingAppointments[appointment.id]}
                >
                  {processingAppointments[appointment.id] ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : null}
                  Reschedule
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No upcoming appointments scheduled.
          </div>
        )}
      </div>
      <Button variant="ghost" className="w-full mt-3 text-sm">
        View All Appointments
      </Button>
    </div>
  );
};

export default UpcomingAppointmentsCard;
