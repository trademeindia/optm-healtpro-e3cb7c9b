
import { GoogleCalendarEvent, Appointment } from './types';

/**
 * Calendar utility functions
 */
export class CalendarUtils {
  /**
   * Default timezone used for calendar operations
   */
  static readonly DEFAULT_TIMEZONE = 'America/Los_Angeles';

  /**
   * Convert appointment to Google Calendar event format
   */
  static appointmentToCalendarEvent(appointment: Appointment, eventId?: string): GoogleCalendarEvent {
    const startDateTime = new Date(`${appointment.date} ${appointment.time}`);
    // Default appointment duration is 30 minutes
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

    return {
      id: eventId,
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
  }
}
