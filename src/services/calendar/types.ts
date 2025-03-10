
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

export interface CreateAppointmentRequest {
  type: string;
  date: string;
  time: string;
  doctorName: string;
  patientName: string;
  patientId: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed';
}

export interface CalendarAuthData {
  id: string;
  accessToken: string | null;
  refreshToken?: string;
  expiresAt?: string;
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    name?: string;
  }>;
  status?: 'confirmed' | 'tentative' | 'cancelled';
}
