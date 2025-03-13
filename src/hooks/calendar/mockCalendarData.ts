
import { addDays, addHours, format, parseISO, setHours, setMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, UpcomingAppointment } from './types';

// Generate some mock calendar events around the given date
export function generateMockEvents(baseDate: Date): CalendarEvent[] {
  console.log("Generating mock calendar events around:", baseDate);
  
  const today = new Date(baseDate);
  today.setHours(0, 0, 0, 0);
  
  const events: CalendarEvent[] = [];
  
  // Common appointment types and their durations (in minutes)
  const appointmentTypes = [
    { type: 'Initial Consultation', duration: 60, color: '#4f46e5' },
    { type: 'Follow-up', duration: 30, color: '#0891b2' },
    { type: 'Physical Therapy', duration: 45, color: '#059669' },
    { type: 'Wellness Check', duration: 30, color: '#7c3aed' },
    { type: 'Massage Therapy', duration: 60, color: '#db2777' },
    { type: 'Lab Work', duration: 20, color: '#ea580c' },
    { type: 'X-Ray', duration: 15, color: '#84cc16' },
    { type: 'Annual Physical', duration: 60, color: '#14b8a6' }
  ];
  
  // Common patient names
  const patientNames = [
    'John Smith', 'Emma Johnson', 'Michael Brown', 'Sophia Williams', 
    'James Davis', 'Olivia Miller', 'Robert Wilson', 'Isabella Martinez',
    'David Anderson', 'Mia Jackson', 'Joseph Thomas', 'Charlotte Harris',
    'Daniel White', 'Amelia Martin', 'Matthew Thompson', 'Harper Garcia'
  ];
  
  // Create events for the past 2 days, today, and next 5 days
  for (let dayOffset = -2; dayOffset <= 5; dayOffset++) {
    const currentDate = addDays(today, dayOffset);
    
    // Generate 2-5 events per day
    const eventCount = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < eventCount; i++) {
      // Random start hour between 9 AM and 4 PM
      const startHour = Math.floor(Math.random() * 8) + 9;
      // Random start minute (0, 15, 30, 45)
      const startMinute = Math.floor(Math.random() * 4) * 15;
      
      const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
      const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
      
      // Create start and end dates
      const startDate = setMinutes(setHours(currentDate, startHour), startMinute);
      const endDate = addHours(startDate, appointmentType.duration / 60);
      
      // Determine if this is a past, current, or future appointment
      const isPastAppointment = startDate < new Date();
      
      // Determine status based on date
      let status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' = 'scheduled';
      
      if (isPastAppointment) {
        // 80% chance that a past appointment was completed, 20% chance it was cancelled
        status = Math.random() < 0.8 ? 'completed' : 'cancelled';
      } else {
        // For future appointments, 60% chance it's confirmed, 40% it's just scheduled
        status = Math.random() < 0.6 ? 'confirmed' : 'scheduled';
      }
      
      // 10% of appointments have notes
      const hasNotes = Math.random() < 0.1;
      const notes = hasNotes ? 
        `Patient requested ${Math.random() < 0.5 ? 'phone call reminder' : 'email confirmation'}.` : 
        '';
      
      // Create the event
      events.push({
        id: uuidv4(),
        title: `${appointmentType.type} - ${patientName}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        color: appointmentType.color,
        allDay: false,
        patientName: patientName,
        appointmentType: appointmentType.type,
        status: status,
        notes: notes,
        location: 'Main Clinic',
        patientId: `patient-${Math.floor(Math.random() * 1000) + 1}`,
        doctorId: `doctor-${Math.floor(Math.random() * 10) + 1}`,
        doctorName: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
        createdAt: new Date(startDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString() // 1-7 days before
      });
    }
  }
  
  // Sort events by start date
  events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  
  console.log(`Generated ${events.length} mock calendar events`);
  return events;
}

// Map calendar events to upcoming appointments format
export function mapEventsToAppointments(events: CalendarEvent[]): UpcomingAppointment[] {
  const now = new Date();
  
  // Filter for future events only and events that aren't cancelled
  const futureEvents = events.filter(event => 
    new Date(event.start) > now && 
    event.status !== 'cancelled' &&
    event.status !== 'completed'
  );
  
  // Sort by date, nearest first
  futureEvents.sort((a, b) => 
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  
  // Take the first 5 events
  const upcomingEvents = futureEvents.slice(0, 5);
  
  // Map to appointment format
  return upcomingEvents.map(event => ({
    id: event.id,
    patientName: event.patientName || 'Unknown Patient',
    patientId: (event as any).patientId || undefined,
    doctorName: (event as any).doctorName || 'Unknown Doctor',
    doctorId: (event as any).doctorId || undefined,
    date: new Date(event.start),
    time: format(parseISO(event.start), 'h:mm a'),
    endTime: format(parseISO(event.end), 'h:mm a'),
    type: event.appointmentType || 'Appointment',
    status: event.status || 'scheduled',
    notes: event.notes || '',
    location: event.location || 'Main Office'
  }));
}
