
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Types
export interface Appointment {
  id: string;
  patientName: string;
  patientId: number;
  time: string;
  date: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface TherapySession {
  id: string;
  patientName: string;
  patientId: number;
  therapyType: string;
  progress: number;
  sessionsCompleted: number;
  totalSessions: number;
  nextSession: string;
}

export interface ClinicMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ClinicDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface ClinicReminder {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'appointment' | 'meeting' | 'reminder';
}

export interface CalendarEvents {
  [date: string]: CalendarEvent[];
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  address: string;
  phone: string;
  email: string;
  condition: string;
  icdCode: string;
  lastVisit: string;
  nextVisit: string;
  medicalRecords: any[];
}

export const useDashboardState = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  // Mock data functions
  const getMockAppointments = (): Appointment[] => [
    {
      id: 'apt1',
      patientName: 'Emma Rodriguez',
      patientId: 2,
      time: '9:00 AM - 9:30 AM',
      date: 'Today',
      type: 'Follow-up appointment',
      status: 'confirmed'
    },
    {
      id: 'apt2',
      patientName: 'Marcus Johnson',
      patientId: 3,
      time: '11:15 AM - 12:00 PM',
      date: 'Today',
      type: 'Rehabilitation session',
      status: 'scheduled'
    },
    {
      id: 'apt3',
      patientName: 'Nikolas Pascal',
      patientId: 1,
      time: '3:30 PM - 4:15 PM',
      date: 'Today',
      type: 'Treatment assessment',
      status: 'scheduled'
    },
    {
      id: 'apt4',
      patientName: 'Sarah Chen',
      patientId: 4,
      time: '10:00 AM - 10:45 AM',
      date: 'Tomorrow',
      type: 'Initial consultation',
      status: 'scheduled'
    },
    {
      id: 'apt5',
      patientName: 'David Wilson',
      patientId: 5,
      time: '2:15 PM - 3:00 PM',
      date: 'Tomorrow',
      type: 'Physical therapy',
      status: 'confirmed'
    }
  ];

  const getMockTherapySchedules = (): TherapySession[] => [
    {
      id: 'th1',
      patientName: 'Nikolas Pascal',
      patientId: 1,
      therapyType: 'Physical Therapy - Shoulder Rehabilitation',
      progress: 45,
      sessionsCompleted: 5,
      totalSessions: 12,
      nextSession: 'Today, 3:30 PM'
    },
    {
      id: 'th2',
      patientName: 'Emma Rodriguez',
      patientId: 2,
      therapyType: 'Lower back pain management',
      progress: 70,
      sessionsCompleted: 7,
      totalSessions: 10,
      nextSession: 'Today, 9:00 AM'
    },
    {
      id: 'th3',
      patientName: 'Marcus Johnson',
      patientId: 3,
      therapyType: 'Sports injury rehabilitation',
      progress: 30,
      sessionsCompleted: 3,
      totalSessions: 8,
      nextSession: 'Today, 11:15 AM'
    }
  ];

  const getMockClinicMessages = (): ClinicMessage[] => [
    {
      id: 'msg1',
      sender: 'Emma Rodriguez',
      content: "Hi Dr. Smith, I'm experiencing increased pain in my lower back after yesterday's session. Should I be concerned?",
      timestamp: '10:32 AM',
      isRead: false
    },
    {
      id: 'msg2',
      sender: 'Dr. Taylor (Staff)',
      content: "Patient files for today's appointments have been updated. Please review before sessions.",
      timestamp: '9:15 AM',
      isRead: true
    },
    {
      id: 'msg3',
      sender: 'Sarah Chen',
      content: 'Just confirming my appointment for tomorrow at 10 AM. Looking forward to meeting you.',
      timestamp: 'Yesterday',
      isRead: true
    },
    {
      id: 'msg4',
      sender: 'Reception',
      content: 'Reminder: Staff meeting scheduled for Friday at 12:30 PM in Conference Room B.',
      timestamp: 'Yesterday',
      isRead: false
    }
  ];

  const getMockClinicDocuments = (): ClinicDocument[] => [
    {
      id: 'doc1',
      name: 'X-Ray Report - Left Shoulder',
      type: 'X-Ray',
      date: 'Jun 5, 2023',
      size: '2.4 MB'
    },
    {
      id: 'doc2',
      name: 'MRI Report - Shoulder',
      type: 'MRI',
      date: 'Jun 7, 2023',
      size: '3.8 MB'
    },
    {
      id: 'doc3',
      name: 'Blood Test Results',
      type: 'Lab',
      date: 'Jun 10, 2023',
      size: '1.2 MB'
    },
    {
      id: 'doc4',
      name: 'Treatment Plan - Phase 1',
      type: 'Plan',
      date: 'Jun 12, 2023',
      size: '0.8 MB'
    },
    {
      id: 'doc5',
      name: 'Weekly Progress Notes',
      type: 'Notes',
      date: 'Jun 15, 2023',
      size: '0.5 MB'
    }
  ];

  const getMockClinicReminders = (): ClinicReminder[] => [
    {
      id: 'rem1',
      title: 'Call Emma Rodriguez about therapy progression',
      dueDate: 'Today, 11:00 AM',
      priority: 'high',
      completed: false
    },
    {
      id: 'rem2',
      title: "Review Marcus Johnson's treatment plan",
      dueDate: 'Today, 2:00 PM',
      priority: 'medium',
      completed: false
    },
    {
      id: 'rem3',
      title: 'Order new therapy equipment',
      dueDate: 'Jun 20, 2023',
      priority: 'low',
      completed: true
    },
    {
      id: 'rem4',
      title: 'Submit monthly insurance claims',
      dueDate: 'Jun 25, 2023',
      priority: 'high',
      completed: false
    }
  ];

  const getMockCalendarEvents = (): CalendarEvents => ({
    '2023-06-16': [
      {
        id: 'evt1',
        title: 'Emma Rodriguez - Follow-up',
        time: '9:00 AM',
        type: 'appointment'
      },
      {
        id: 'evt2',
        title: 'Marcus Johnson - Rehab',
        time: '11:15 AM',
        type: 'appointment'
      },
      {
        id: 'evt3',
        title: 'Staff Meeting',
        time: '1:00 PM',
        type: 'meeting'
      }
    ],
    '2023-06-17': [
      {
        id: 'evt4',
        title: 'Sarah Chen - Initial',
        time: '10:00 AM',
        type: 'appointment'
      },
      {
        id: 'evt5',
        title: 'David Wilson - Therapy',
        time: '2:15 PM',
        type: 'appointment'
      }
    ],
    '2023-06-20': [
      {
        id: 'evt6',
        title: 'Insurance Claims Due',
        time: 'All day',
        type: 'reminder'
      }
    ]
  });

  const getMockPatients = (): Patient[] => [
    {
      id: 1,
      name: "Nikolas Pascal",
      age: 32,
      gender: "Male",
      address: "800 Bay St, San Francisco, CA 94133",
      phone: "(555) 123-4567",
      email: "nikolas.p@example.com",
      condition: "Calcific tendinitis of the shoulder",
      icdCode: "M75.3",
      lastVisit: "2023-06-10",
      nextVisit: "2023-06-22",
      medicalRecords: []
    },
    {
      id: 2,
      name: "Emma Rodriguez",
      age: 45,
      gender: "Female",
      address: "1420 Park Ave, San Francisco, CA 94122",
      phone: "(555) 987-6543",
      email: "emma.r@example.com",
      condition: "Lumbar strain",
      icdCode: "M54.5",
      lastVisit: "2023-06-05",
      nextVisit: "2023-06-25",
      medicalRecords: []
    },
    {
      id: 3,
      name: "Marcus Johnson",
      age: 28,
      gender: "Male",
      address: "219 Ellis St, San Francisco, CA 94102",
      phone: "(555) 456-7890",
      email: "marcus.j@example.com",
      condition: "Sports-related knee injury",
      icdCode: "S83.9",
      lastVisit: "2023-06-12",
      nextVisit: "2023-06-19",
      medicalRecords: []
    }
  ];

  // Event handlers
  const handleUploadDocument = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded.",
    });
    setShowUploadDialog(false);
  };

  const handleViewAllAppointments = () => {
    setActiveTab("calendar");
    toast({
      title: "Appointments",
      description: "Viewing all upcoming appointments.",
    });
  };

  const handleViewPatient = (patientId: number) => {
    const patient = getMockPatients().find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    } else {
      toast({
        title: "Patient Not Found",
        description: "Could not find patient record.",
        variant: "destructive"
      });
    }
  };

  const handleClosePatientHistory = () => {
    setSelectedPatient(null);
  };

  const handleUpdatePatient = (updatedPatient: any) => {
    toast({
      title: "Patient Updated",
      description: "Patient information has been updated successfully.",
    });
  };

  const handleViewAllMessages = () => {
    toast({
      title: "Messages",
      description: "Viewing all messages.",
    });
  };

  const handleViewAllDocuments = () => {
    toast({
      title: "Documents",
      description: "Viewing all clinic documents.",
    });
  };

  const handleAddReminder = () => {
    toast({
      title: "Add Reminder",
      description: "Opening reminder form.",
    });
  };

  const handleToggleReminder = (id: string) => {
    toast({
      title: "Reminder Updated",
      description: "Reminder status has been updated.",
    });
  };

  const handleViewFullCalendar = () => {
    setActiveTab("calendar");
    toast({
      title: "Calendar",
      description: "Opening full calendar view.",
    });
  };

  return {
    // State
    activeTab,
    setActiveTab,
    showUploadDialog,
    setShowUploadDialog,
    currentDate,
    setCurrentDate,
    selectedPatient,
    setSelectedPatient,
    
    // Mock data
    appointments: getMockAppointments(),
    therapySchedules: getMockTherapySchedules(),
    clinicMessages: getMockClinicMessages(),
    clinicDocuments: getMockClinicDocuments(),
    clinicReminders: getMockClinicReminders(),
    calendarEvents: getMockCalendarEvents(),
    patients: getMockPatients(),
    
    // Handlers
    handleUploadDocument,
    handleViewAllAppointments,
    handleViewPatient,
    handleClosePatientHistory,
    handleUpdatePatient,
    handleViewAllMessages,
    handleViewAllDocuments,
    handleAddReminder,
    handleToggleReminder,
    handleViewFullCalendar
  };
};
