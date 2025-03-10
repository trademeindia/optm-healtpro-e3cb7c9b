
import { CalendarEvent } from './types';
import { formatDate } from '@/lib/utils';

export function generateMockEvents(baseDate: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Start from Sunday
  
  const patientNames = [
    "Emma Rodriguez", "Marcus Johnson", "Sarah Chen", 
    "David Williams", "Olivia Martinez", "James Wilson",
    "Sophia Thompson", "Alexander Davis", "Ava Garcia"
  ];
  
  const appointmentTypes = [
    "Initial Consultation", "Follow-up", "Physical Therapy", 
    "Examination", "Treatment Review", "Urgent Care"
  ];
  
  const locations = [
    "Main Office - Room 101", "Virtual Meeting", "Clinic A - Floor 2",
    "Rehab Center", "West Wing - Suite 305"
  ];

  // Generate available slots and some booked appointments
  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + day);
    
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    
    if (!isWeekend) {
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const start = new Date(currentDate);
          start.setHours(hour, minute, 0, 0);
          
          const end = new Date(start);
          end.setMinutes(end.getMinutes() + 30);
          
          const isBooked = Math.random() < 0.3;
          
          if (isBooked) {
            const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
            const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            
            events.push({
              id: `appointment-${day}-${hour}-${minute}`,
              title: `${type} - ${patientName}`,
              start,
              end,
              isAvailable: false,
              patientName,
              patientId: `patient-${Math.floor(Math.random() * 1000)}`,
              type,
              location,
              description: `${type} appointment with ${patientName}`
            });
          } else {
            events.push({
              id: `slot-${day}-${hour}-${minute}`,
              title: 'Available',
              start,
              end,
              isAvailable: true
            });
          }
        }
      }
    }
    
    if (Math.random() < 0.4) {
      const startHour = Math.floor(Math.random() * 10) + 8;
      const start = new Date(currentDate);
      start.setHours(startHour, 0, 0, 0);
      
      const durationHours = Math.floor(Math.random() * 3) + 1;
      const end = new Date(start);
      end.setHours(end.getHours() + durationHours);
      
      events.push({
        id: `blocked-${day}-${startHour}`,
        title: 'Blocked',
        start,
        end,
        isAvailable: false
      });
    }
  }
  
  return events;
}

export function mapEventsToAppointments(events: CalendarEvent[]): any[] {
  return events
    .filter(event => !event.isAvailable && new Date(event.start) > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5)
    .map(event => ({
      id: event.id,
      title: event.title,
      date: formatDate(event.start, "MMMM d, yyyy"),
      time: formatDate(event.start, "h:mm a") + " - " + formatDate(event.end, "h:mm a"),
      patientName: event.patientName,
      patientId: event.patientId,
      type: event.type || "Consultation",
      location: event.location
    }));
}
