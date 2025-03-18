
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AppointmentCard, type Appointment } from './appointments';
import { useAppointmentStatus } from '@/hooks/calendar/useAppointmentStatus';

interface UpcomingAppointmentsCardProps {
  upcomingAppointments: Appointment[];
  className?: string;
  onConfirmAppointment?: (id: string) => void;
  onRescheduleAppointment?: (id: string) => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  upcomingAppointments,
  className,
  onConfirmAppointment,
  onRescheduleAppointment
}) => {
  const navigate = useNavigate();
  const { handleConfirmAppointment, updateAppointmentStatus } = useAppointmentStatus();

  // Function to handle appointment confirmation
  const handleConfirm = async (id: string) => {
    const success = await handleConfirmAppointment(id);
    
    if (success) {
      if (onConfirmAppointment) {
        onConfirmAppointment(id);
      }
      
      toast.success("Appointment Confirmed", {
        description: "Your appointment has been confirmed successfully.",
        duration: 3000
      });
    }
  };

  // Function to handle appointment rescheduling
  const handleReschedule = (id: string) => {
    if (onRescheduleAppointment) {
      onRescheduleAppointment(id);
    } else {
      // Navigate to calendar page with appointment ID
      navigate(`/calendar?appointmentId=${id}&action=reschedule`);
      
      toast.info("Reschedule Requested", {
        description: "Please select a new date and time for your appointment.",
        duration: 3000
      });
    }
  };

  // Function to navigate to book new appointment page
  const handleBookAppointment = () => {
    navigate('/calendar?action=new');
  };

  return (
    <div className={`glass-morphism rounded-2xl p-4 md:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={handleBookAppointment}
        >
          <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> Book New
        </Button>
      </div>
      
      <div className="space-y-4">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirmAppointment={handleConfirm}
              onRescheduleAppointment={handleReschedule}
            />
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No upcoming appointments scheduled.
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full mt-3 text-sm"
        aria-label="View all appointments"
        onClick={() => navigate('/calendar')}
      >
        View All Appointments
      </Button>
    </div>
  );
};

export default UpcomingAppointmentsCard;
