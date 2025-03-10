
import { Appointment, GoogleCalendarEvent } from './types';
import { signInToGoogleCalendar } from './googleCalendarApi';

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

/**
 * Update an event in Google Calendar
 */
export const updateGoogleCalendarEvent = async (
  appointment: Appointment
): Promise<boolean> => {
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
};

/**
 * Delete an event from Google Calendar
 */
export const deleteGoogleCalendarEvent = async (eventId: string): Promise<boolean> => {
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
};
