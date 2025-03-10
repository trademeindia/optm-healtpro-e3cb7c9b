
import { toast } from 'sonner';
import { DashboardAppointment } from './types';

export const useAppointments = () => {
  const upcomingAppointments: DashboardAppointment[] = [
    {
      id: '1',
      date: 'June 20, 2023',
      time: '10:30 AM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Follow-up'
    },
    {
      id: '2',
      date: 'July 5, 2023',
      time: '02:00 PM',
      doctor: 'Dr. Nikolas Pascal',
      type: 'Physical Therapy'
    }
  ];

  const handleConfirmAppointment = (id: string) => {
    toast.success("Appointment Confirmed", {
      description: "Your appointment has been confirmed.",
      duration: 3000
    });
  };

  const handleRescheduleAppointment = (id: string) => {
    toast.info("Reschedule Requested", {
      description: "Your request to reschedule has been sent.",
      duration: 3000
    });
  };

  return {
    upcomingAppointments,
    handleConfirmAppointment,
    handleRescheduleAppointment
  };
};
