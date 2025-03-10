
import { Appointment } from '@/services/calendar/types';

/**
 * Mock data for upcoming appointments
 */
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: 'patient-123',
    patientName: 'John Doe',
    doctorId: 'doctor-456',
    doctorName: 'Dr. Nikolas Pascal',
    date: 'June 20, 2023',
    time: '10:30 AM',
    type: 'Follow-up',
    status: 'scheduled'
  },
  {
    id: '2',
    patientId: 'patient-123',
    patientName: 'John Doe',
    doctorId: 'doctor-456',
    doctorName: 'Dr. Nikolas Pascal',
    date: 'July 5, 2023',
    time: '02:00 PM',
    type: 'Physical Therapy',
    status: 'scheduled'
  }
];
