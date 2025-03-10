
import { Appointment, GoogleCalendarService } from './googleCalendarService';
import { storeInLocalStorage, getFromLocalStorage } from '../storage/localStorageService';
import { useToast } from '@/hooks/use-toast';

/**
 * Service to handle appointment operations
 */
export class AppointmentService {
  private static readonly APPOINTMENTS_KEY = 'appointments';

  /**
   * Get all appointments
   */
  static getAppointments(): Appointment[] {
    return getFromLocalStorage(this.APPOINTMENTS_KEY);
  }

  /**
   * Get appointment by ID
   */
  static getAppointmentById(id: string): Appointment | null {
    const appointments = this.getAppointments();
    return appointments.find(appointment => appointment.id === id) || null;
  }

  /**
   * Create a new appointment
   */
  static async createAppointment(appointment: Omit<Appointment, 'id' | 'googleEventId'>): Promise<Appointment | null> {
    try {
      const id = 'appointment-' + Date.now();
      const newAppointment: Appointment = {
        ...appointment,
        id
      };

      // Try to create a Google Calendar event if user is authenticated
      if (GoogleCalendarService.isAuthenticated()) {
        const eventId = await GoogleCalendarService.createEvent(newAppointment);
        if (eventId) {
          newAppointment.googleEventId = eventId;
        }
      }

      // Store appointment
      storeInLocalStorage(this.APPOINTMENTS_KEY, newAppointment);
      
      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      return null;
    }
  }

  /**
   * Update an existing appointment
   */
  static async updateAppointment(appointment: Appointment): Promise<boolean> {
    try {
      // Store appointment
      storeInLocalStorage(this.APPOINTMENTS_KEY, appointment);
      
      // Update Google Calendar event if exists
      if (appointment.googleEventId && GoogleCalendarService.isAuthenticated()) {
        await GoogleCalendarService.updateEvent(appointment);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating appointment:', error);
      return false;
    }
  }

  /**
   * Confirm an appointment
   */
  static async confirmAppointment(id: string): Promise<boolean> {
    try {
      const appointment = this.getAppointmentById(id);
      if (!appointment) {
        return false;
      }

      const updatedAppointment = {
        ...appointment,
        status: 'confirmed' as const
      };

      return this.updateAppointment(updatedAppointment);
    } catch (error) {
      console.error('Error confirming appointment:', error);
      return false;
    }
  }

  /**
   * Cancel an appointment
   */
  static async cancelAppointment(id: string): Promise<boolean> {
    try {
      const appointment = this.getAppointmentById(id);
      if (!appointment) {
        return false;
      }

      const updatedAppointment = {
        ...appointment,
        status: 'cancelled' as const
      };

      const result = await this.updateAppointment(updatedAppointment);
      
      // Delete from Google Calendar if needed
      if (result && appointment.googleEventId && GoogleCalendarService.isAuthenticated()) {
        await GoogleCalendarService.deleteEvent(appointment.googleEventId);
      }
      
      return result;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return false;
    }
  }

  /**
   * Reschedule an appointment
   */
  static async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<boolean> {
    try {
      const appointment = this.getAppointmentById(id);
      if (!appointment) {
        return false;
      }

      const updatedAppointment = {
        ...appointment,
        date: newDate,
        time: newTime,
        status: 'scheduled' as const
      };

      return this.updateAppointment(updatedAppointment);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return false;
    }
  }
}
