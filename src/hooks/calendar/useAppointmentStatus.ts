
import { AppointmentStatus } from '@/types/appointment';
import { toast } from 'sonner';

export interface AppointmentStatusUpdate {
  appointmentId: string;
  status: AppointmentStatus;
  successMessage?: string;
}

export const useAppointmentStatus = () => {
  const updateAppointmentStatus = async (
    appointmentId: string,
    newStatus: AppointmentStatus
  ): Promise<boolean> => {
    try {
      console.log(`Updating appointment ${appointmentId} status to ${newStatus}`);
      
      // In a real app, this would be an API call
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let successMessage = '';
      
      switch (newStatus) {
        case 'confirmed':
          successMessage = 'Appointment confirmed successfully';
          break;
        case 'cancelled':
          successMessage = 'Appointment cancelled';
          break;
        case 'completed':
          successMessage = 'Appointment marked as completed';
          break;
        default:
          successMessage = 'Appointment status updated';
      }
      
      toast.success(successMessage);
      return true;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
      return false;
    }
  };

  const handleConfirmAppointment = async (appointmentId: string): Promise<boolean> => {
    return updateAppointmentStatus(appointmentId, 'confirmed');
  };

  const handleCancelAppointment = async (appointmentId: string): Promise<boolean> => {
    return updateAppointmentStatus(appointmentId, 'cancelled');
  };

  const handleCompleteAppointment = async (appointmentId: string): Promise<boolean> => {
    return updateAppointmentStatus(appointmentId, 'completed');
  };

  return {
    updateAppointmentStatus,
    handleConfirmAppointment,
    handleCancelAppointment,
    handleCompleteAppointment
  };
};
