
import { CalendarAuthService } from './calendarAuthService';
import { CalendarEventService } from './calendarEventService';
import { Appointment, GoogleCalendarEvent } from './types';

/**
 * Facade service to handle Google Calendar operations
 */
export class GoogleCalendarService {
  /**
   * Check if the user is authenticated with Google Calendar
   */
  static isAuthenticated(): boolean {
    return CalendarAuthService.isAuthenticated();
  }

  /**
   * Authenticate with Google Calendar
   */
  static async authenticate(): Promise<boolean> {
    return CalendarAuthService.authenticate();
  }

  /**
   * Disconnect from Google Calendar
   */
  static disconnect(): boolean {
    return CalendarAuthService.disconnect();
  }

  /**
   * Create a calendar event from an appointment
   */
  static async createEvent(appointment: Appointment): Promise<string | null> {
    return CalendarEventService.createEvent(appointment);
  }

  /**
   * Update a calendar event
   */
  static async updateEvent(appointment: Appointment): Promise<boolean> {
    return CalendarEventService.updateEvent(appointment);
  }

  /**
   * Delete a calendar event
   */
  static async deleteEvent(eventId: string): Promise<boolean> {
    return CalendarEventService.deleteEvent(eventId);
  }

  /**
   * Get all calendar events
   */
  static async getEvents(): Promise<GoogleCalendarEvent[]> {
    return CalendarEventService.getEvents();
  }
}

// Re-export types for backward compatibility
export type { Appointment, GoogleCalendarEvent } from './types';
