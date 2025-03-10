
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAvailable: boolean;
  patientId?: string;
  patientName?: string;
  type?: string;
  location?: string;
  description?: string;
}

export interface UpcomingAppointment {
  id: string;
  title: string;
  date: string;
  time: string;
  patientName?: string;
  patientId?: string;
  type: string;
  location?: string;
}
