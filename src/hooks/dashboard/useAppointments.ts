
import { useState } from 'react';
import { AppointmentWithProvider } from '@/types/appointments';
import { toast } from 'sonner';

export const useAppointments = () => {
  // Mock appointments data
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentWithProvider[]>([
    {
      id: 'a1',
      patientId: 'p1',
      providerId: 'dr1',
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
      time: '10:30',
      status: 'scheduled',
      type: 'Follow-up Consultation',
      location: 'Main Clinic, Room 204',
      provider: {
        id: 'dr1',
        name: 'Dr. Emily Johnson',
        specialty: 'Orthopedic Surgeon',
        avatarUrl: ''
      }
    },
    {
      id: 'a2',
      patientId: 'p1',
      providerId: 'dr2',
      date: new Date(Date.now() + 86400000 * 7).toISOString(),
      time: '14:15',
      status: 'scheduled',
      type: 'Physical Therapy',
      location: 'Rehabilitation Center, East Wing',
      provider: {
        id: 'dr2',
        name: 'Dr. Michael Chen',
        specialty: 'Physical Therapist',
        avatarUrl: ''
      }
    }
  ]);

  const handleConfirmAppointment = (appointmentId: string) => {
    setUpcomingAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'confirmed' } 
          : appointment
      )
    );
    toast.success('Appointment confirmed', {
      description: 'You will receive a reminder 24 hours before your appointment.',
      duration: 4000
    });
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    // In a real app, this would open a dialog to select a new date/time
    toast.info('Reschedule request sent', {
      description: 'The clinic will contact you to arrange a new appointment time.',
      duration: 4000
    });
  };

  return {
    upcomingAppointments,
    handleConfirmAppointment,
    handleRescheduleAppointment
  };
};
