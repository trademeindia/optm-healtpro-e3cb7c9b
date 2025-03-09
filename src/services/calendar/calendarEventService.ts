
import { getFromLocalStorage, storeInLocalStorage } from '../storage/localStorageService';
import { CALENDAR_CONFIG } from './calendarConfig';
import { Appointment, GoogleCalendarEvent } from './types';
import { CalendarAuthService } from './calendarAuthService';

/**
 * Service to handle Google Calendar events
 */
export class CalendarEventService {
  /**
   * Create a calendar event from an appointment
   */
  static async createEvent(appointment: Appointment): Promise<string | null> {
    try {
      if (!CalendarAuthService.isAuthenticated()) {
        console.error('Not authenticated with Google Calendar');
        return null;
      }

      const startDateTime = new Date(`${appointment.date} ${appointment.time}`);
      // Default appointment duration is 30 minutes
      const endDateTime = new Date(startDateTime.getTime() + CALENDAR_CONFIG.DEFAULT_APPOINTMENT_DURATION * 60000);

      const event: GoogleCalendarEvent = {
        summary: `${appointment.type} with ${appointment.patientName}`,
        description: appointment.notes || `Appointment with ${appointment.patientName}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: CALENDAR_CONFIG.DEFAULT_TIMEZONE
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: CALENDAR_CONFIG.DEFAULT_TIMEZONE
        },
        attendees: [
          { email: 'patient@example.com', name: appointment.patientName }
        ],
        status: appointment.status === 'confirmed' ? 'confirmed' : 'tentative'
      };

      // In a real implementation, this would call the Google Calendar API
      // For now, we'll store in localStorage
      const eventId = 'event-' + Date.now();
      const calendarEvent = { ...event, id: eventId };
      
      // Store the event
      storeInLocalStorage(CALENDAR_CONFIG.STORAGE_KEYS.EVENTS_KEY, calendarEvent);
      
      console.log('Created Google Calendar event (mock):', calendarEvent);
      
      return eventId;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      return null;
    }
  }

  /**
   * Update a calendar event
   */
  static async updateEvent(appointment: Appointment): Promise<boolean> {
    try {
      if (!CalendarAuthService.isAuthenticated() || !appointment.googleEventId) {
        return false;
      }

      // Get existing events
      const events = getFromLocalStorage(CALENDAR_CONFIG.STORAGE_KEYS.EVENTS_KEY);
      const eventIndex = events.findIndex((e: GoogleCalendarEvent) => e.id === appointment.googleEventId);
      
      if (eventIndex === -1) {
        console.error('Event not found:', appointment.googleEventId);
        return false;
      }

      const startDateTime = new Date(`${appointment.date} ${appointment.time}`);
      const endDateTime = new Date(startDateTime.getTime() + CALENDAR_CONFIG.DEFAULT_APPOINTMENT_DURATION * 60000);

      const updatedEvent: GoogleCalendarEvent = {
        ...events[eventIndex],
        summary: `${appointment.type} with ${appointment.patientName}`,
        description: appointment.notes || `Appointment with ${appointment.patientName}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: CALENDAR_CONFIG.DEFAULT_TIMEZONE
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: CALENDAR_CONFIG.DEFAULT_TIMEZONE
        },
        status: appointment.status === 'confirmed' ? 'confirmed' : 'tentative'
      };

      // Update the event in localStorage
      storeInLocalStorage(CALENDAR_CONFIG.STORAGE_KEYS.EVENTS_KEY, updatedEvent);
      
      console.log('Updated Google Calendar event (mock):', updatedEvent);
      
      return true;
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      return false;
    }
  }

  /**
   * Delete a calendar event
   */
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      if (!CalendarAuthService.isAuthenticated()) {
        return false;
      }

      // In a real implementation, this would call the Google Calendar API
      // For now, we'll simulate success
      console.log('Deleted Google Calendar event (mock):', eventId);
      
      return true;
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      return false;
    }
  }

  /**
   * Get all calendar events
   */
  static async getEvents(): Promise<GoogleCalendarEvent[]> {
    try {
      if (!CalendarAuthService.isAuthenticated()) {
        return [];
      }

      // In a real implementation, this would call the Google Calendar API
      // For now, we'll return mock data from localStorage
      const events = getFromLocalStorage(CALENDAR_CONFIG.STORAGE_KEYS.EVENTS_KEY);
      return events;
    } catch (error) {
      console.error('Error getting Google Calendar events:', error);
      return [];
    }
  }
}
