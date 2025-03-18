
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppointmentCard, type Appointment } from './appointments';
import { Calendar, RefreshCw } from 'lucide-react';
import { useCalendarIntegration } from '@/hooks/calendar/useCalendarIntegration';

interface UpcomingAppointmentsCardProps {
  upcomingAppointments: Appointment[];
  className?: string;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  upcomingAppointments: initialAppointments,
  className = '',
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Use the calendar integration hook to get real-time data from the user's calendar
  const { 
    isAuthorized, 
    refreshCalendar,
    upcomingAppointments: calendarAppointments
  } = useCalendarIntegration();

  // Function to synchronize appointments between props and calendar
  useEffect(() => {
    // Initialize with prop data first
    if (initialAppointments && initialAppointments.length > 0) {
      setAppointments(initialAppointments);
    }
    
    // If calendar is authorized, try to get the latest data
    if (isAuthorized && calendarAppointments && calendarAppointments.length > 0) {
      // Map calendar appointments to the expected format
      const mappedAppointments = calendarAppointments.map(calAppt => ({
        id: calAppt.id,
        date: typeof calAppt.date === 'string' ? calAppt.date : calAppt.date.toLocaleDateString(),
        time: calAppt.time,
        doctor: calAppt.patientName ? 'Dr. ' + (calAppt.patientName.split(' ')[0] || 'Unknown') : 'Unknown Doctor',
        type: calAppt.type || calAppt.title || 'Appointment',
        status: calAppt.status || 'scheduled'
      }));
      
      setAppointments(mappedAppointments);
    }
  }, [initialAppointments, isAuthorized, calendarAppointments]);

  // Function to handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    setIsLoading(true);
    
    try {
      if (onConfirmAppointment) {
        onConfirmAppointment(id);
      } else {
        // If no handler is provided, use default behavior
        toast.success("Your appointment has been confirmed.", {
          duration: 3000
        });
        
        // Update the local state to reflect the change
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.id === id 
              ? { ...appointment, status: 'confirmed' } 
              : appointment
          )
        );
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error("Failed to confirm appointment. Please try again.");
      setSyncError("Confirmation failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = (id: string) => {
    setIsLoading(true);
    
    try {
      if (onRescheduleAppointment) {
        onRescheduleAppointment(id);
      } else {
        // If no handler is provided, use default behavior
        toast.success("Your request to reschedule has been sent.", {
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast.error("Failed to request reschedule. Please try again.");
      setSyncError("Rescheduling request failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh appointments data
  const handleRefreshAppointments = async () => {
    if (!isAuthorized) {
      toast.error("Calendar not connected", {
        description: "Connect your calendar to sync appointments",
        duration: 3000
      });
      return;
    }
    
    setIsLoading(true);
    setSyncError(null);
    
    try {
      await refreshCalendar();
      toast.success("Appointments refreshed successfully");
    } catch (error) {
      console.error("Error refreshing appointments:", error);
      toast.error("Failed to refresh appointments");
      setSyncError("Refresh failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`glass-morphism rounded-2xl p-4 md:p-6 shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <div className="flex gap-2">
          {isAuthorized && (
            <button 
              onClick={handleRefreshAppointments}
              className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-colors"
              disabled={isLoading}
              aria-label="Refresh appointments"
            >
              <RefreshCw className={`h-5 w-5 text-primary ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
      
      {syncError && (
        <div className="mb-4 p-2 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/30 rounded-md text-sm text-red-600 dark:text-red-400">
          {syncError}. <button className="underline" onClick={handleRefreshAppointments}>Try again</button>
        </div>
      )}
      
      <div className="space-y-4">
        {isLoading && appointments.length === 0 ? (
          // Loading state when no appointments are available
          <div className="animate-pulse space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="rounded-lg bg-muted/50 h-24"></div>
            ))}
          </div>
        ) : appointments.length > 0 ? (
          // Render appointments when available
          appointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirmAppointment={handleConfirmAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
            />
          ))
        ) : (
          // Empty state
          <div className="text-center py-6 bg-muted/30 rounded-lg">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              No upcoming appointments scheduled.
            </p>
            {isAuthorized && (
              <p className="text-sm text-muted-foreground mt-2">
                <button 
                  className="underline focus:outline-none" 
                  onClick={handleRefreshAppointments}
                >
                  Refresh
                </button> to check for new appointments
              </p>
            )}
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full mt-4 text-sm hover:bg-primary/5"
        aria-label="View all appointments"
      >
        View All Appointments
      </Button>
    </div>
  );
};

export default UpcomingAppointmentsCard;
