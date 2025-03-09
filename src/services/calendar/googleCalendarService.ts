
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, storeInLocalStorage } from '../storage/localStorageService';

// Types for Google Calendar
export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: {
    email: string;
    name?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }[];
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  googleEventId?: string;
}

/**
 * Service to handle Google Calendar operations
 */
export class GoogleCalendarService {
  private static readonly CALENDAR_AUTH_KEY = 'google_calendar_auth';
  private static readonly CALENDAR_EVENTS_KEY = 'calendar_events';
  private static readonly DEFAULT_TIMEZONE = 'America/Los_Angeles';

  /**
   * Check if the user is authenticated with Google Calendar
   */
  static isAuthenticated(): boolean {
    // In a real implementation, this would check the OAuth token
    // For now, we'll simulate with localStorage
    const authData = getFromLocalStorage(this.CALENDAR_AUTH_KEY);
    return authData.length > 0 && !!authData[0]?.accessToken;
  }

  /**
   * Authenticate with Google Calendar
   */
  static async authenticate(): Promise<boolean> {
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll simulate successful authentication
      const mockAuthData = {
        id: 'auth-' + Date.now(),
        accessToken: 'mock-access-token-' + Math.random().toString(36).substring(2),
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };
      
      storeInLocalStorage(this.CALENDAR_AUTH_KEY, mockAuthData);
      console.log('Authenticated with Google Calendar (mock)');
      return true;
    } catch (error) {
      console.error('Error authenticating with Google Calendar:', error);
      return false;
    }
  }

  /**
   * Disconnect from Google Calendar
   */
  static disconnect(): boolean {
    try {
      // Clear auth data from localStorage
      storeInLocalStorage(this.CALENDAR_AUTH_KEY, { id: 'removed', accessToken: null });
      return true;
    } catch (error) {
      console.error('Error disconnecting from Google Calendar:', error);
      return false;
    }
  }

  /**
   * Create a calendar event from an appointment
   */
  static async createEvent(appointment: Appointment): Promise<string | null> {
    try {
      if (!this.isAuthenticated()) {
        console.error('Not authenticated with Google Calendar');
        return null;
      }

      const startDateTime = new Date(`${appointment.date} ${appointment.time}`);
      // Default appointment duration is 30 minutes
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

      const event: GoogleCalendarEvent = {
        summary: `${appointment.type} with ${appointment.patientName}`,
        description: appointment.notes || `Appointment with ${appointment.patientName}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: this.DEFAULT_TIMEZONE
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: this.DEFAULT_TIMEZONE
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
      storeInLocalStorage(this.CALENDAR_EVENTS_KEY, calendarEvent);
      
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
      if (!this.isAuthenticated() || !appointment.googleEventId) {
        return false;
      }

      // Get existing events
      const events = getFromLocalStorage(this.CALENDAR_EVENTS_KEY);
      const eventIndex = events.findIndex((e: GoogleCalendarEvent) => e.id === appointment.googleEventId);
      
      if (eventIndex === -1) {
        console.error('Event not found:', appointment.googleEventId);
        return false;
      }

      const startDateTime = new Date(`${appointment.date} ${appointment.time}`);
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

      const updatedEvent: GoogleCalendarEvent = {
        ...events[eventIndex],
        summary: `${appointment.type} with ${appointment.patientName}`,
        description: appointment.notes || `Appointment with ${appointment.patientName}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: this.DEFAULT_TIMEZONE
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: this.DEFAULT_TIMEZONE
        },
        status: appointment.status === 'confirmed' ? 'confirmed' : 'tentative'
      };

      // Update the event in localStorage
      storeInLocalStorage(this.CALENDAR_EVENTS_KEY, updatedEvent);
      
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
      if (!this.isAuthenticated()) {
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
      if (!this.isAuthenticated()) {
        return [];
      }

      // In a real implementation, this would call the Google Calendar API
      // For now, we'll return mock data from localStorage
      const events = getFromLocalStorage(this.CALENDAR_EVENTS_KEY);
      return events;
    } catch (error) {
      console.error('Error getting Google Calendar events:', error);
      return [];
    }
  }
}
