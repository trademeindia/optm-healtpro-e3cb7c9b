
import { GoogleCalendarEvent } from './types';

/**
 * Google Calendar API initialization and authentication
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
 * Check if user is authenticated with Google Calendar
 */
export const isGoogleCalendarAuthenticated = (): boolean => {
  return window.gapi?.auth2?.getAuthInstance()?.isSignedIn.get() || false;
};
