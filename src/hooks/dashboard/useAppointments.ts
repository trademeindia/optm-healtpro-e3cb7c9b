
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status?: string;
  location?: string;
}

export function useAppointments() {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // For a real app, this would query Supabase
      // For now, using mock data
      
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          date: '2023-06-20T10:30:00',
          time: '10:30 AM',
          doctor: 'Dr. Nikolas Pascal',
          type: 'Follow-up',
          status: 'scheduled',
          location: 'Main Clinic'
        },
        {
          id: '2',
          date: '2023-07-05T14:00:00',
          time: '02:00 PM',
          doctor: 'Dr. Nikolas Pascal',
          type: 'Physical Therapy',
          status: 'scheduled',
          location: 'Rehabilitation Center'
        },
        {
          id: '3',
          date: '2023-05-15T09:00:00',
          time: '09:00 AM',
          doctor: 'Dr. Sarah Johnson',
          type: 'Annual Check-up',
          status: 'completed',
          location: 'Main Clinic'
        }
      ];
      
      // Split into upcoming and past
      const now = new Date();
      const upcoming = mockAppointments.filter(
        appt => new Date(appt.date) > now && appt.status !== 'cancelled'
      );
      const past = mockAppointments.filter(
        appt => new Date(appt.date) < now || appt.status === 'cancelled'
      );
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch appointments'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleConfirmAppointment = useCallback(async (id: string) => {
    try {
      // In a real app, this would call a Supabase RPC function
      toast.success('Appointment confirmed successfully');
      
      // Update local state
      setUpcomingAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: 'confirmed' } : app)
      );
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  }, []);

  const handleRescheduleAppointment = useCallback((id: string) => {
    // In a real app, this would open a date picker dialog
    toast.info('Reschedule feature coming soon');
  }, []);

  return {
    upcomingAppointments,
    pastAppointments,
    isLoading,
    error,
    handleConfirmAppointment,
    handleRescheduleAppointment,
    refresh: fetchAppointments
  };
}
