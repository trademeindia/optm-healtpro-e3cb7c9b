
import { UserMetadata } from "@supabase/supabase-js";

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

export interface CalendarAuthData {
  id: string;
  accessToken: string | null;
  refreshToken?: string;
  expiresAt?: string;
}
