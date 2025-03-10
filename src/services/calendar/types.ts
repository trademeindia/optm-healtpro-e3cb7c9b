
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
