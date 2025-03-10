
import { GoogleCalendarEvent, Appointment } from './types';

/**
 * Service for integrating with Google Calendar
 */

// OAuth credentials
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

interface GoogleAuthConfig {
  clientId: string;
  apiKey: string;
  discoveryDocs: string[];
  scope: string;
}

// Config for Google Calendar API
const GOOGLE_AUTH_CONFIG: GoogleAuthConfig = {
  clientId: CLIENT_ID,
  apiKey: API_KEY,
  discoveryDocs: [DISCOVERY_DOC],
  scope: SCOPES
};

// Define gapi globally since it's loaded via script tag
declare global {
  interface Window {
    gapi: any;
  }
}

/**
 * Initialize Google Calendar API
 */
export const initGoogleCalendarApi = async (): Promise<boolean> => {
  if (!CLIENT_ID || !API_KEY) {
    console.error('Google Calendar credentials not set');
    return false;
  }
  
  try {
    // Load Google API client library
    await new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
    
    // Load the API client
    await new Promise<void>((resolve, reject) => {
      window.gapi.load('client:auth2', {
        callback: resolve,
        onerror: reject
      });
    });
    
    // Initialize the client
    await window.gapi.client.init(GOOGLE_AUTH_CONFIG);
    
    return true;
  } catch (error) {
    console.error('Error initializing Google Calendar API:', error);
    return false;
  }
};

/**
 * Sign in to Google Calendar
 */
export const signInToGoogleCalendar = async (): Promise<boolean> => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }
    return true;
  } catch (error) {
    console.error('Error signing in to Google Calendar:', error);
    return false;
  }
};

/**
 * Sign out from Google Calendar
 */
export const signOutFromGoogleCalendar = async (): Promise<boolean> => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      await authInstance.signOut();
    }
    return true;
  } catch (error) {
    console.error('Error signing out from Google Calendar:', error);
    return false;
  }
};

/**
 * Create an event in Google Calendar
 */
export const createGoogleCalendarEvent = async (
  appointment: Appointment
): Promise<string | null> => {
  try {
    // Sign in if not already
    await signInToGoogleCalendar();
    
    // Construct event object from appointment
    const event: GoogleCalendarEvent = {
      summary: `${appointment.type} with ${appointment.doctorName}`,
      description: `Appointment for ${appointment.patientName}`,
      start: {
        dateTime: new Date(`${appointment.date} ${appointment.time}`).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: new Date(`${appointment.date} ${appointment.time}`).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      attendees: [
        { email: 'doctor@example.com', name: appointment.doctorName }
      ]
    };
    
    // Insert the event
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
    
    return response.result.id || null;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
};

// Create a class to be exported for appointmentService.ts to use
export class GoogleCalendarService {
  static isAuthenticated() {
    return window.gapi?.auth2?.getAuthInstance()?.isSignedIn.get() || false;
  }
  
  static async createEvent(appointment: Appointment): Promise<string | null> {
    return createGoogleCalendarEvent(appointment);
  }
  
  static async updateEvent(appointment: Appointment): Promise<boolean> {
    try {
      if (!appointment.googleEventId) {
        return false;
      }
      
      await signInToGoogleCalendar();
      
      const event: GoogleCalendarEvent = {
        summary: `${appointment.type} with ${appointment.doctorName}`,
        description: `Appointment for ${appointment.patientName}`,
        start: {
          dateTime: new Date(`${appointment.date} ${appointment.time}`).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: new Date(`${appointment.date} ${appointment.time}`).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      await window.gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: appointment.googleEventId,
        resource: event
      });
      
      return true;
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      return false;
    }
  }
  
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await signInToGoogleCalendar();
      
      await window.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      return false;
    }
  }
  
  // Add the missing authenticate method
  static async authenticate(): Promise<boolean> {
    try {
      await initGoogleCalendarApi();
      return signInToGoogleCalendar();
    } catch (error) {
      console.error('Error authenticating with Google Calendar:', error);
      return false;
    }
  }
  
  // Add the missing disconnect method
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
export type { GoogleCalendarEvent, Appointment };
