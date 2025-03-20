
export interface Appointment {
  id: string;
  date: string;
  time: string;
  status?: string;
  type: string;
  doctor: string;
  patientId?: string;
  providerId?: string;
  location?: string;
  provider?: {
    id: string;
    name: string;
    specialty: string;
  };
}

export interface AppointmentWithProvider {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  time: string;
  status: string;
  type: string;
  location: string;
  provider: {
    id: string;
    name: string;
    specialty: string;
  };
}
