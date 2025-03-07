
import { toast } from "@/hooks/use-toast";

// Google Calendar API configuration
const API_KEY = "YOUR_API_KEY"; // This should be replaced with an environment variable in production
const CLIENT_ID = "YOUR_CLIENT_ID"; // This should be replaced with an environment variable in production
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient: google.accounts.oauth2.TokenClient;
let gapiInited = false;
let gisInited = false;

interface CalendarEvent {
  id?: string;
  summary: string;
  description: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

/**
 * Callback after the API client is loaded. Loads the discovery doc to initialize the API.
 */
const initializeGapiClient = async () => {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
};

/**
 * Callback after Google Identity Services are loaded.
 */
const initializeGisClient = () => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
};

/**
 * Enable buttons after both APIs are initialized.
 */
const maybeEnableButtons = () => {
  if (gapiInited && gisInited) {
    document.dispatchEvent(new Event('gapi-loaded'));
  }
};

/**
 * Initialize the API client and Identity Services.
 */
export const initializeGoogleApi = () => {
  // Load the Google API client library
  const script1 = document.createElement("script");
  script1.src = "https://apis.google.com/js/api.js";
  script1.onload = () => {
    gapi.load("client", initializeGapiClient);
  };
  document.body.appendChild(script1);

  // Load the Google Identity Services library
  const script2 = document.createElement("script");
  script2.src = "https://accounts.google.com/gsi/client";
  script2.onload = initializeGisClient;
  document.body.appendChild(script2);
};

/**
 * Sign in to Google Calendar API.
 */
export const signInToGoogleCalendar = () => {
  return new Promise<void>((resolve, reject) => {
    if (!tokenClient) {
      reject("Token client not initialized");
      return;
    }

    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        reject(resp.error);
        return;
      }
      resolve();
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session
      tokenClient.requestAccessToken({ prompt: "" });
    }
  });
};

/**
 * Sign out of Google Calendar API.
 */
export const signOutFromGoogleCalendar = () => {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken(null);
    localStorage.removeItem('googleCalendarSyncEnabled');
    return true;
  }
  return false;
};

/**
 * Check if the user is signed in to Google Calendar.
 */
export const isSignedInToGoogleCalendar = () => {
  return gapi.client && gapi.client.getToken() !== null;
};

/**
 * Convert our appointment to Google Calendar event.
 */
export const appointmentToCalendarEvent = (appointment: any): CalendarEvent => {
  // Parse date and time
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [startTime, endTime] = appointment.time.split(' - ');
  
  // Convert time format "09:00 AM" to Date object
  const getTimeDate = (timeStr: string, date: string) => {
    const [hours, minutes] = timeStr.split(':');
    const isPM = timeStr.includes('PM');
    let hour = parseInt(hours);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    
    const dateObj = new Date(date);
    dateObj.setHours(hour);
    dateObj.setMinutes(parseInt(minutes));
    return dateObj;
  };
  
  const startDate = getTimeDate(startTime, appointment.date);
  const endDate = getTimeDate(endTime, appointment.date);
  
  // Create Google Calendar event
  return {
    summary: `Appointment with ${appointment.patientName}`,
    description: appointment.reason || 'Medical appointment',
    location: appointment.type === 'in-person' ? 'Medical Office' : undefined,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 }, // 30 minutes before
      ],
    },
  };
};

/**
 * Add an appointment to Google Calendar.
 */
export const addAppointmentToCalendar = async (appointment: any) => {
  try {
    if (!isSignedInToGoogleCalendar()) {
      await signInToGoogleCalendar();
    }
    
    const event = appointmentToCalendarEvent(appointment);
    const request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });
    
    const response = await request.execute();
    
    toast({
      title: "Appointment Added to Calendar",
      description: "The appointment has been synced with Google Calendar.",
    });
    
    return response.id;
  } catch (error) {
    console.error("Error adding appointment to calendar", error);
    toast({
      title: "Calendar Sync Failed",
      description: "Could not add the appointment to Google Calendar.",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Update an appointment in Google Calendar.
 */
export const updateAppointmentInCalendar = async (appointment: any, eventId: string) => {
  try {
    if (!isSignedInToGoogleCalendar()) {
      await signInToGoogleCalendar();
    }
    
    const event = appointmentToCalendarEvent(appointment);
    const request = gapi.client.calendar.events.update({
      'calendarId': 'primary',
      'eventId': eventId,
      'resource': event
    });
    
    await request.execute();
    
    toast({
      title: "Calendar Updated",
      description: "The appointment has been updated in Google Calendar.",
    });
    
    return true;
  } catch (error) {
    console.error("Error updating appointment in calendar", error);
    toast({
      title: "Calendar Update Failed",
      description: "Could not update the appointment in Google Calendar.",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Delete an appointment from Google Calendar.
 */
export const deleteAppointmentFromCalendar = async (eventId: string) => {
  try {
    if (!isSignedInToGoogleCalendar()) {
      await signInToGoogleCalendar();
    }
    
    const request = gapi.client.calendar.events.delete({
      'calendarId': 'primary',
      'eventId': eventId
    });
    
    await request.execute();
    
    toast({
      title: "Appointment Removed",
      description: "The appointment has been removed from Google Calendar.",
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting appointment from calendar", error);
    toast({
      title: "Calendar Sync Failed",
      description: "Could not remove the appointment from Google Calendar.",
      variant: "destructive",
    });
    throw error;
  }
};
