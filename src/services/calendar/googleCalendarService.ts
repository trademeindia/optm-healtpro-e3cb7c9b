
import { Appointment } from './types';
import { 
  initGoogleCalendarApi, 
  signInToGoogleCalendar, 
  signOutFromGoogleCalendar,
  isGoogleCalendarAuthenticated 
} from './googleCalendarApi';
import { 
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent
} from './googleCalendarEvents';

/**
 * Service for integrating with Google Calendar
 */
export class GoogleCalendarService {
  static isAuthenticated() {
    return isGoogleCalendarAuthenticated();
  }
  
  static async createEvent(appointment: Appointment): Promise<string | null> {
    return createGoogleCalendarEvent(appointment);
  }
  
  static async updateEvent(appointment: Appointment): Promise<boolean> {
    return updateGoogleCalendarEvent(appointment);
  }
  
  static async deleteEvent(eventId: string): Promise<boolean> {
    return deleteGoogleCalendarEvent(eventId);
  }
  
  static async authenticate(): Promise<boolean> {
    try {
      await initGoogleCalendarApi();
      return signInToGoogleCalendar();
    } catch (error) {
      console.error('Error authenticating with Google Calendar:', error);
      return false;
    }
  }
  
  static disconnect(): boolean {
    try {
      const authInstance = window.gapi?.auth2?.getAuthInstance();
      if (authInstance && authInstance.isSignedIn.get()) {
        authInstance.signOut();
      }
      return true;
    } catch (error) {
      console.error('Error disconnecting from Google Calendar:', error);
      return false;
    }
  }
}

// Use 'export type' for re-exporting types
export type { GoogleCalendarEvent, Appointment } from './types';
