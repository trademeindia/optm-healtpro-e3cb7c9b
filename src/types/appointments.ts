
export interface Provider {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  type: string;
  location: string;
  notes?: string;
  doctor?: string; // Added for compatibility
}

export interface AppointmentWithProvider extends Appointment {
  provider: Provider;
}
