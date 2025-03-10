
export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
  description?: string;
  location?: string;
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  doctorName?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
  type?: string;
  color?: string;
  isAvailable?: boolean;
}

export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface UpcomingAppointment {
  id: string;
  title: string;
  date: string;
  time: string;
  patientName?: string;
  patientId?: string;
  type?: string;
  location?: string;
}
