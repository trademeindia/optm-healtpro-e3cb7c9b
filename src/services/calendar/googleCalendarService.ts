
export interface Appointment {
  id: string;
  type: string;
  date: string;
  time: string;
  doctorName: string;
  patientName: string;
  patientId: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed';
  googleEventId?: string;
}

export class GoogleCalendarService {
  private static readonly LOCAL_STORAGE_KEY = 'google_calendar_connected';

  /**
   * Check if the user is authenticated with Google Calendar
   */
  static isAuthenticated(): boolean {
    return localStorage.getItem(this.LOCAL_STORAGE_KEY) === 'true';
  }
  
  /**
   * Authenticate with Google Calendar
   * In a real app, this would redirect to Google OAuth
   */
  static async authenticate(): Promise<boolean> {
    // Simulate successful authentication
    localStorage.setItem(this.LOCAL_STORAGE_KEY, 'true');
    return true;
  }
  
  /**
   * Disconnect from Google Calendar
   * In a real app, this would revoke access tokens
   */
  static disconnect(): boolean {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, 'false');
      return true;
    } catch (error) {
      console.error('Error disconnecting from Google Calendar:', error);
      return false;
    }
  }
  
  /**
   * Sync an appointment with Google Calendar
   * In a real app, this would create a Google Calendar event
   */
  static async syncAppointment(appointment: Appointment): Promise<string | null> {
    // Simulate creating an event in Google Calendar
    console.log('Syncing appointment with Google Calendar:', appointment);
    
    // In a real app, we would call the Google Calendar API here
    const googleEventId = `google-event-${appointment.id}`;
    
    return googleEventId;
  }
}
