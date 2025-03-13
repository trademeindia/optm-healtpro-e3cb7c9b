
import { CalendarEvent, UpcomingAppointment } from './types';
import { AppointmentStatus } from '@/types/appointment';
import { format, addDays, addHours, startOfDay, subDays, eachDayOfInterval } from 'date-fns';

const appointmentTypes = [
  "Initial Consultation",
  "Follow-up",
  "Physical Therapy",
  "Examination",
  "Treatment Review",
  "Urgent Care"
];

const patientNames = [
  "Emma Rodriguez",
  "Marcus Johnson",
  "Sarah Chen",
  "Jamie Smith",
  "David Wilson",
  "Sophia Garcia",
  "Michael Brown",
  "Olivia Taylor",
  "Noah Davis",
  "Ava Martinez"
];

const doctors = [
  "Dr. Jane Foster",
  "Dr. Stephen Palmer",
  "Dr. Maria Rodriguez",
  "Dr. James Wilson",
  "Dr. Lisa Chen"
];

const locations = [
  "Main Office - Room 101",
  "Virtual Meeting",
  "Clinic A - Floor 2",
  "Rehab Center",
  "West Wing - Suite 305"
];

const statuses: AppointmentStatus[] = ['scheduled', 'confirmed', 'cancelled', 'completed'];

const generateRandomTime = (date: Date): Date => {
  const hours = 8 + Math.floor(Math.random() * 9); // 8 AM to 5 PM
  const minutes = Math.random() > 0.5 ? 0 : 30; // Either on the hour or half past
  
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  );
};

const generateRandomAppointment = (date: Date, isAvailable = false): CalendarEvent => {
  const startTime = generateRandomTime(date);
  const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes later
  
  const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
  const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
  const doctor = doctors[Math.floor(Math.random() * doctors.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  if (isAvailable) {
    return {
      id: `available-${date.getTime()}-${Math.random()}`,
      title: 'Available Slot',
      start: startTime,
      end: endTime,
      isAvailable: true,
      location,
      doctorName: doctor,
      color: '#4caf50'
    };
  }
  
  return {
    id: `appointment-${date.getTime()}-${Math.random()}`,
    title: `${type} - ${patientName}`,
    start: startTime,
    end: endTime,
    description: `Regular ${type.toLowerCase()} appointment`,
    patientName,
    doctorName: doctor,
    location,
    type,
    status,
    isAvailable: false,
    color: '#2196f3'
  };
};

export const generateMockEvents = (referenceDate: Date, changeCounter: number = 0): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  
  // Generate events for the past week up to next week
  const startDate = subDays(startOfDay(referenceDate), 7);
  const endDate = addDays(startOfDay(referenceDate), 14);
  
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Generate 2-5 appointments per day
  dates.forEach(date => {
    const numEvents = 2 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numEvents; i++) {
      // 70% booked, 30% available
      const isAvailable = Math.random() > 0.7;
      events.push(generateRandomAppointment(date, isAvailable));
    }
  });
  
  // Add some events specifically for today
  const today = startOfDay(new Date());
  const numTodayEvents = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numTodayEvents; i++) {
    const isAvailable = Math.random() > 0.8; // 20% chance of available slots today
    events.push(generateRandomAppointment(today, isAvailable));
  }
  
  // If changeCounter is provided and greater than 0, add extra events based on the counter
  if (changeCounter > 0) {
    const extraEvents = changeCounter > 5 ? 5 : changeCounter;
    
    for (let i = 0; i < extraEvents; i++) {
      const futureDate = addDays(today, i + 1);
      events.push(generateRandomAppointment(futureDate, false));
    }
  }
  
  return events;
};

export const mapEventsToAppointments = (events: CalendarEvent[]): UpcomingAppointment[] => {
  const now = new Date();
  
  return events
    .filter(event => 
      !event.isAvailable && 
      new Date(event.start) > now && 
      event.status !== 'cancelled'
    )
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5) // Take only next 5 appointments
    .map(event => {
      const startDate = event.start instanceof Date ? event.start : new Date(event.start);
      
      return {
        id: event.id,
        title: event.title,
        date: format(startDate, 'MMMM d, yyyy'),
        time: format(startDate, 'h:mm a'),
        patientName: event.patientName,
        patientId: event.patientId,
        type: event.type,
        location: event.location,
        status: event.status
      };
    });
};
