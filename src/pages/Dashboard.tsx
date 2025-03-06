import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Upload, X, Plus
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import TherapySchedules from '@/components/dashboard/TherapySchedules';
import ClinicMessages from '@/components/dashboard/ClinicMessages';
import ClinicDocuments from '@/components/dashboard/ClinicDocuments';
import ClinicReminders from '@/components/dashboard/ClinicReminders';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import PatientRecords from '@/components/dashboard/PatientRecords';
import { FileText, Calendar, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();

  const upcomingAppointments = [
    {
      id: 'apt1',
      patientName: 'Emma Rodriguez',
      patientId: 2,
      time: '9:00 AM - 9:30 AM',
      date: 'Today',
      type: 'Follow-up appointment',
      status: 'confirmed' as const
    },
    {
      id: 'apt2',
      patientName: 'Marcus Johnson',
      patientId: 3,
      time: '11:15 AM - 12:00 PM',
      date: 'Today',
      type: 'Rehabilitation session',
      status: 'scheduled' as const
    },
    {
      id: 'apt3',
      patientName: 'Nikolas Pascal',
      patientId: 1,
      time: '3:30 PM - 4:15 PM',
      date: 'Today',
      type: 'Treatment assessment',
      status: 'scheduled' as const
    },
    {
      id: 'apt4',
      patientName: 'Sarah Chen',
      patientId: 4,
      time: '10:00 AM - 10:45 AM',
      date: 'Tomorrow',
      type: 'Initial consultation',
      status: 'scheduled' as const
    },
    {
      id: 'apt5',
      patientName: 'David Wilson',
      patientId: 5,
      time: '2:15 PM - 3:00 PM',
      date: 'Tomorrow',
      type: 'Physical therapy',
      status: 'confirmed' as const
    }
  ];

  const therapySchedules = [
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

  const clinicMessages = [
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

  const clinicDocuments = [
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

  const clinicReminders = [
    {
      id: 'rem1',
      title: 'Call Emma Rodriguez about therapy progression',
      dueDate: 'Today, 11:00 AM',
      priority: 'high' as const,
      completed: false
    },
    {
      id: 'rem2',
      title: "Review Marcus Johnson's treatment plan",
      dueDate: 'Today, 2:00 PM',
      priority: 'medium' as const,
      completed: false
    },
    {
      id: 'rem3',
      title: 'Order new therapy equipment',
      dueDate: 'Jun 20, 2023',
      priority: 'low' as const,
      completed: true
    },
    {
      id: 'rem4',
      title: 'Submit monthly insurance claims',
      dueDate: 'Jun 25, 2023',
      priority: 'high' as const,
      completed: false
    }
  ];

  const calendarEvents = {
    '2023-06-16': [
      {
        id: 'evt1',
        title: 'Emma Rodriguez - Follow-up',
        time: '9:00 AM',
        type: 'appointment' as const
      },
      {
        id: 'evt2',
        title: 'Marcus Johnson - Rehab',
        time: '11:15 AM',
        type: 'appointment' as const
      },
      {
        id: 'evt3',
        title: 'Staff Meeting',
        time: '1:00 PM',
        type: 'meeting' as const
      }
    ],
    '2023-06-17': [
      {
        id: 'evt4',
        title: 'Sarah Chen - Initial',
        time: '10:00 AM',
        type: 'appointment' as const
      },
      {
        id: 'evt5',
        title: 'David Wilson - Therapy',
        time: '2:15 PM',
        type: 'appointment' as const
      }
    ],
    '2023-06-20': [
      {
        id: 'evt6',
        title: 'Insurance Claims Due',
        time: 'All day',
        type: 'reminder' as const
      }
    ]
  };

  const patients = [
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
      lastVisit: "Jun 10, 2023",
      nextVisit: "Jun 22, 2023"
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
      lastVisit: "Jun 05, 2023",
      nextVisit: "Jun 25, 2023"
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
      lastVisit: "Jun 12, 2023",
      nextVisit: "Jun 19, 2023"
    }
  ];

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
    toast({
      title: "Patient Profile",
      description: `Opening patient profile #${patientId}.`,
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

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Doctor Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your clinic, appointments, and patient care
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients, records..." 
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <Button 
                  className="gap-1.5" 
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden md:inline">Upload</span>
                </Button>
              </div>
            </div>
            
            <Tabs 
              defaultValue="overview" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                <TabsTrigger value="overview" className="rounded-md">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="patients" className="rounded-md">
                  Patients
                </TabsTrigger>
                <TabsTrigger value="reports" className="rounded-md">
                  Reports & Documents
                </TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-md">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="calendar" className="rounded-md">
                  Calendar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-8">
                    <UpcomingAppointments 
                      appointments={upcomingAppointments}
                      onViewAll={handleViewAllAppointments}
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <MiniCalendar 
                      currentDate={currentDate} 
                      events={calendarEvents}
                      onDateChange={setCurrentDate}
                      onViewFullCalendar={handleViewFullCalendar}
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <TherapySchedules 
                      therapySessions={therapySchedules}
                      onViewPatient={handleViewPatient}
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <ClinicMessages 
                      messages={clinicMessages}
                      onViewAll={handleViewAllMessages}
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <ClinicReminders 
                      reminders={clinicReminders}
                      onAddReminder={handleAddReminder}
                      onToggleReminder={handleToggleReminder}
                    />
                  </div>
                  
                  <div className="md:col-span-12">
                    <ClinicDocuments 
                      documents={clinicDocuments}
                      onUpload={() => setShowUploadDialog(true)}
                      onViewAll={handleViewAllDocuments}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="patients" className="mt-0">
                <PatientRecords patients={patients} />
              </TabsContent>
              
              <TabsContent value="reports" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Reports & Documents</h2>
                  <p className="text-muted-foreground mb-6">
                    View and manage all patient reports and medical documents
                  </p>
                  
                  <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
                    <div className="text-center max-w-sm">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your files here, or click to select files
                      </p>
                      <Button onClick={() => setShowUploadDialog(true)}>
                        Select Files
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
                  <p className="text-muted-foreground mb-6">
                    View patient analytics and treatment outcomes
                  </p>
                  
                  <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                      <p className="text-sm text-muted-foreground">
                        Analytics features will be available soon
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Appointment Calendar</h2>
                  <p className="text-muted-foreground mb-6">
                    Manage and schedule patient appointments
                  </p>
                  
                  <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Calendar View</h3>
                      <p className="text-sm text-muted-foreground">
                        Calendar features will be available soon
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload medical reports, X-rays, or other documents for the patient.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag files here or click to upload</p>
              <p className="text-xs text-muted-foreground mb-4">
                Supports PDF, JPEG, PNG files up to 10MB
              </p>
              <Button size="sm">Select Files</Button>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm font-medium">Document Details</div>
              
              <div className="space-y-2">
                <label className="text-sm">Document Name</label>
                <Input placeholder="e.g., X-Ray Report - Left Shoulder" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Document Type</label>
                <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <option>X-Ray</option>
                  <option>MRI</option>
                  <option>Lab Report</option>
                  <option>Treatment Plan</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Date</label>
                <Input type="date" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>
              Upload Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
