
import { v4 as uuidv4 } from 'uuid';
import { Appointment, CreateAppointmentRequest } from './types';
import { supabase } from '@/integrations/supabase/client';

// In-memory store for appointments (used as fallback when Supabase is not available)
let localAppointments: Appointment[] = [
  {
    id: '1',
    type: 'Check-up',
    date: 'March 15, 2025',
    time: '10:00 AM',
    doctorName: 'Dr. Sarah Johnson',
    patientName: 'John Doe',
    patientId: 'patient-123',
    status: 'scheduled'
  },
  {
    id: '2',
    type: 'Follow-up',
    date: 'March 22, 2025',
    time: '2:30 PM',
    doctorName: 'Dr. Michael Chen',
    patientName: 'John Doe',
    patientId: 'patient-123',
    status: 'confirmed',
    googleEventId: 'google-event-123'
  }
];

export class AppointmentService {
  /**
   * Get all appointments for the current patient
   */
  static getAppointments(): Appointment[] {
    console.log('Getting appointments from service');
    try {
      // First try to get from localStorage
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        const parsed = JSON.parse(storedAppointments);
        console.log('Found appointments in localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error retrieving appointments from localStorage:', error);
    }
    
    // Return default appointments if nothing in localStorage
    console.log('Using default appointments');
    return localAppointments;
  }
  
  /**
   * Create a new appointment
   */
  static async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment | null> {
    try {
      console.log('Creating appointment:', appointmentData);
      
      // Create new appointment with unique ID
      const newAppointment: Appointment = {
        ...appointmentData,
        id: uuidv4()
      };
      
      // Try to store in Supabase if available
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // In a real app, we would insert into Supabase here
          console.log('Would store appointment in Supabase for user:', user.id);
        }
      } catch (error) {
        console.error('Supabase error, falling back to local storage:', error);
      }
      
      // Store in localStorage as fallback
      const currentAppointments = this.getAppointments();
      const updatedAppointments = [newAppointment, ...currentAppointments];
      
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      console.log('Appointment created and saved to localStorage');
      
      // Also update our in-memory store
      localAppointments = updatedAppointments;
      
      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      return null;
    }
  }
  
  /**
   * Confirm an appointment
   */
  static async confirmAppointment(id: string): Promise<boolean> {
    try {
      console.log('Confirming appointment:', id);
      const appointments = this.getAppointments();
      const updatedAppointments = appointments.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status: 'confirmed' as const } 
          : appointment
      );
      
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      localAppointments = updatedAppointments;
      
      return true;
    } catch (error) {
      console.error('Error confirming appointment:', error);
      return false;
    }
  }
  
  /**
   * Reschedule an appointment
   */
  static async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<boolean> {
    try {
      console.log('Rescheduling appointment:', id, newDate, newTime);
      const appointments = this.getAppointments();
      const updatedAppointments = appointments.map(appointment => 
        appointment.id === id 
          ? { ...appointment, date: newDate, time: newTime } 
          : appointment
      );
      
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      localAppointments = updatedAppointments;
      
      return true;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return false;
    }
  }
}
