
import { Appointment } from './googleCalendarService';
import { storeInLocalStorage } from '../storage/localStorageService';

/**
 * Initialize sample appointments data for testing
 */
export const initializeSampleAppointments = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const sampleAppointments: Appointment[] = [
    {
      id: 'appointment-1',
      patientId: 'patient-123',
      patientName: 'John Doe',
      doctorId: 'doctor-456',
      doctorName: 'Dr. Nikolas Pascal',
      date: formatDate(tomorrow),
      time: '10:30 AM',
      type: 'Follow-up Consultation',
      status: 'confirmed',
      notes: 'Review recent test results',
      googleEventId: 'sample-event-1'
    },
    {
      id: 'appointment-2',
      patientId: 'patient-123',
      patientName: 'John Doe',
      doctorId: 'doctor-456',
      doctorName: 'Dr. Nikolas Pascal',
      date: formatDate(nextWeek),
      time: '02:00 PM',
      type: 'Physical Therapy',
      status: 'scheduled',
      notes: 'First therapy session',
    },
    {
      id: 'appointment-3',
      patientId: 'patient-123',
      patientName: 'John Doe',
      doctorId: 'doctor-789',
      doctorName: 'Dr. Sarah Chen',
      date: formatDate(twoWeeksLater),
      time: '11:15 AM',
      type: 'Annual Checkup',
      status: 'scheduled',
      notes: 'Regular annual checkup',
    }
  ];
  
  // Store in localStorage
  sampleAppointments.forEach(appointment => {
    storeInLocalStorage('appointments', appointment);
  });
  
  console.log('Sample appointments initialized');
  
  return sampleAppointments;
};
