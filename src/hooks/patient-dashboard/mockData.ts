
// Mock data for activity tracking
export const activityData = [
  { day: 'Mon', value: 8500 },
  { day: 'Tue', value: 9200 },
  { day: 'Wed', value: 7800 },
  { day: 'Thu', value: 8100 },
  { day: 'Fri', value: 10200 },
  { day: 'Sat', value: 6500 },
  { day: 'Sun', value: 7300 }
];

// Mock data for treatment tasks
export const treatmentTasks = [
  {
    id: '1',
    title: 'Heat therapy - 15 minutes',
    time: '08:00 AM',
    completed: true
  },
  {
    id: '2',
    title: 'Stretching exercises - Series A',
    time: '11:30 AM',
    completed: true
  },
  {
    id: '3',
    title: 'Apply anti-inflammatory cream',
    time: '02:00 PM',
    completed: false
  },
  {
    id: '4',
    title: 'Resistance band exercises',
    time: '05:00 PM',
    completed: false
  }
];

// Mock upcoming appointments
export const upcomingAppointments = [
  {
    id: '1',
    date: 'June 20, 2023',
    time: '10:30 AM',
    doctor: 'Dr. Nikolas Pascal',
    type: 'Follow-up'
  },
  {
    id: '2',
    date: 'July 5, 2023',
    time: '02:00 PM',
    doctor: 'Dr. Nikolas Pascal',
    type: 'Physical Therapy'
  }
];
