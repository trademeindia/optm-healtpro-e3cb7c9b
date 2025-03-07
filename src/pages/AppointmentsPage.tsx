
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { 
  addAppointmentToCalendar,
  updateAppointmentInCalendar,
  deleteAppointmentFromCalendar
} from '@/utils/googleCalendar';
import { 
  Calendar as CalendarIcon, Clock, User, Plus, Search, 
  ChevronLeft, ChevronRight, Filter, MoreHorizontal, 
  Video, Phone, Calendar, CheckCircle
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Extended appointment interface
interface Appointment {
  id: number;
  patientName: string;
  patientId: string;
  reason: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  calendarEventId?: string;
  reminderSent?: boolean;
}

const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showReminderSettingsDialog, setShowReminderSettingsDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();
  const { isSignedIn, isLoading, syncEnabled, signIn, signOut, toggleSync } = useGoogleCalendar();
  
  // Reminder settings
  const [reminderSettings, setReminderSettings] = useState({
    emailReminders: true,
    emailReminderTime: "24",  // hours before
    browserReminders: true,
    browserReminderTime: "30" // minutes before
  });

  // Sample appointment data (extended with calendar event IDs)
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: "Nikolas Pascal",
      patientId: "PT-1001",
      reason: "Follow-up appointment",
      date: "2023-06-22",
      time: "09:00 AM - 09:30 AM",
      type: "in-person",
      status: "confirmed",
      calendarEventId: "",
      reminderSent: false
    },
    {
      id: 2,
      patientName: "Emma Rodriguez",
      patientId: "PT-1002",
      reason: "Pain management consultation",
      date: "2023-06-22",
      time: "11:15 AM - 12:00 PM",
      type: "video",
      status: "confirmed",
      calendarEventId: "",
      reminderSent: false
    },
    {
      id: 3,
      patientName: "Marcus Johnson",
      patientId: "PT-1003",
      reason: "Rehabilitation session",
      date: "2023-06-22",
      time: "02:30 PM - 03:15 PM",
      type: "in-person",
      status: "confirmed",
      calendarEventId: "",
      reminderSent: false
    },
    {
      id: 4,
      patientName: "Sophia Williams",
      patientId: "PT-1004",
      reason: "Initial consultation",
      date: "2023-06-23",
      time: "10:00 AM - 11:00 AM",
      type: "phone",
      status: "pending",
      calendarEventId: "",
      reminderSent: false
    },
    {
      id: 5,
      patientName: "Emma Rodriguez",
      patientId: "PT-1002",
      reason: "Medication review",
      date: "2023-06-24",
      time: "09:30 AM - 10:00 AM",
      type: "in-person",
      status: "confirmed",
      calendarEventId: "",
      reminderSent: false
    }
  ]);

  // Filter appointments
  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= new Date());
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  
  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    appointmentType: "in-person",
    date: "",
    time: "",
    duration: "30",
    reason: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async () => {
    // Create new appointment
    const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
    const patient = appointments.find(a => a.patientId === newAppointment.patientId);
    
    const startTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
    const endTime = new Date(startTime.getTime() + parseInt(newAppointment.duration) * 60000);
    
    const formattedStartTime = startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    
    const formattedEndTime = endTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    
    const appointment: Appointment = {
      id: newId,
      patientName: patient?.patientName || "Unknown Patient",
      patientId: newAppointment.patientId,
      reason: newAppointment.reason,
      date: newAppointment.date,
      time: `${formattedStartTime} - ${formattedEndTime}`,
      type: newAppointment.appointmentType as 'in-person' | 'video' | 'phone',
      status: "confirmed",
      calendarEventId: "",
      reminderSent: false
    };
    
    // Add to Google Calendar if sync enabled
    if (syncEnabled && isSignedIn) {
      try {
        const eventId = await addAppointmentToCalendar(appointment);
        appointment.calendarEventId = eventId;
      } catch (error) {
        console.error("Failed to sync with calendar", error);
      }
    }
    
    setAppointments(prev => [...prev, appointment]);
    toast({
      title: "Appointment Scheduled",
      description: "The appointment has been successfully scheduled.",
    });
    setShowAddDialog(false);
  };

  const handleConfirmAppointment = async (id: number) => {
    setAppointments(prev => prev.map(appointment => {
      if (appointment.id === id) {
        return { ...appointment, status: "confirmed" };
      }
      return appointment;
    }));
    
    toast({
      title: "Appointment Confirmed",
      description: `Appointment #${id} has been confirmed.`,
    });
    
    // Sync with calendar if enabled
    const appointment = appointments.find(a => a.id === id);
    if (appointment && syncEnabled && isSignedIn) {
      try {
        if (appointment.calendarEventId) {
          await updateAppointmentInCalendar(
            { ...appointment, status: "confirmed" },
            appointment.calendarEventId
          );
        } else {
          const eventId = await addAppointmentToCalendar({ ...appointment, status: "confirmed" });
          setAppointments(prev => prev.map(a => {
            if (a.id === id) {
              return { ...a, status: "confirmed", calendarEventId: eventId };
            }
            return a;
          }));
        }
      } catch (error) {
        console.error("Failed to sync with calendar", error);
      }
    }
  };

  const handleRescheduleAppointment = (id: number) => {
    toast({
      title: "Reschedule Initiated",
      description: `You can now reschedule appointment #${id}.`,
    });
  };

  const handleCancelAppointment = async (id: number) => {
    const appointment = appointments.find(a => a.id === id);
    
    // Remove from Google Calendar if synced
    if (appointment?.calendarEventId && syncEnabled && isSignedIn) {
      try {
        await deleteAppointmentFromCalendar(appointment.calendarEventId);
      } catch (error) {
        console.error("Failed to remove from calendar", error);
      }
    }
    
    setAppointments(prev => prev.map(appointment => {
      if (appointment.id === id) {
        return { ...appointment, status: "cancelled", calendarEventId: undefined };
      }
      return appointment;
    }));
    
    toast({
      title: "Appointment Cancelled",
      description: `Appointment #${id} has been cancelled.`,
    });
  };

  const nextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const prevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleSaveReminderSettings = () => {
    setShowReminderSettingsDialog(false);
    toast({
      title: "Reminder Settings Saved",
      description: "Your appointment reminder settings have been updated.",
    });
  };

  // Handle sync all appointments
  const handleSyncAllAppointments = async () => {
    if (!isSignedIn) {
      try {
        await signIn();
      } catch (error) {
        return;
      }
    }
    
    let successCount = 0;
    let failCount = 0;
    
    // Only sync upcoming appointments
    for (const appointment of upcomingAppointments) {
      if (appointment.status !== "cancelled" && !appointment.calendarEventId) {
        try {
          const eventId = await addAppointmentToCalendar(appointment);
          
          // Update the appointment with the calendar event ID
          setAppointments(prev => prev.map(a => {
            if (a.id === appointment.id) {
              return { ...a, calendarEventId: eventId };
            }
            return a;
          }));
          
          successCount++;
        } catch (error) {
          console.error("Failed to sync appointment", appointment.id, error);
          failCount++;
        }
      }
    }
    
    toast({
      title: "Calendar Sync Complete",
      description: `Successfully synced ${successCount} appointments${failCount > 0 ? `, ${failCount} failed` : ''}.`,
      variant: failCount > 0 ? "destructive" : "default",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Appointments</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule and manage patient appointments
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search appointments..." 
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => setShowReminderSettingsDialog(true)}
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden md:inline">Reminders</span>
                </Button>
                
                <Button 
                  className="gap-1.5" 
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">New Appointment</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Google Calendar Sync</h3>
                    <p className="text-sm text-muted-foreground">
                      Sync your appointments with Google Calendar
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-9 w-24 rounded-md"></div>
                  ) : isSignedIn ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={syncEnabled}
                          onCheckedChange={toggleSync}
                          id="calendar-sync"
                        />
                        <Label htmlFor="calendar-sync">
                          {syncEnabled ? "Sync enabled" : "Sync disabled"}
                        </Label>
                      </div>
                      
                      {syncEnabled && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSyncAllAppointments}
                        >
                          Sync All
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={signOut}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button onClick={signIn}>
                      Connect Google Calendar
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Tabs 
                  defaultValue="upcoming" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                    <TabsTrigger value="upcoming" className="rounded-md">
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger value="today" className="rounded-md">
                      Today
                    </TabsTrigger>
                    <TabsTrigger value="all" className="rounded-md">
                      All Appointments
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="mt-0 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold">Upcoming Appointments</h3>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {upcomingAppointments.map(appointment => (
                          <div key={appointment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{appointment.patientName}</span>
                                  {appointment.calendarEventId && (
                                    <span className="inline-flex items-center bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                                      <CalendarIcon className="h-3 w-3 mr-1" />
                                      Synced
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{appointment.date}</span>
                                  <Clock className="h-4 w-4 ml-2" />
                                  <span>{appointment.time}</span>
                                </div>
                                <div className="text-sm">{appointment.reason}</div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {appointment.type === 'video' && (
                                  <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <Video className="h-3 w-3" />
                                    <span>Join</span>
                                  </Button>
                                )}
                                {appointment.type === 'phone' && (
                                  <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <Phone className="h-3 w-3" />
                                    <span>Call</span>
                                  </Button>
                                )}
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8"
                                  onClick={() => handleRescheduleAppointment(appointment.id)}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="today" className="mt-0 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold">Today's Appointments</h3>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {todayAppointments.length > 0 ? (
                          todayAppointments.map(appointment => (
                            <div key={appointment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{appointment.patientName}</span>
                                    {appointment.calendarEventId && (
                                      <span className="inline-flex items-center bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                        Synced
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  <div className="text-sm">{appointment.reason}</div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {appointment.type === 'video' && (
                                    <Button size="sm" variant="outline" className="h-8 gap-1">
                                      <Video className="h-3 w-3" />
                                      <span>Join</span>
                                    </Button>
                                  )}
                                  {appointment.type === 'phone' && (
                                    <Button size="sm" variant="outline" className="h-8 gap-1">
                                      <Phone className="h-3 w-3" />
                                      <span>Call</span>
                                    </Button>
                                  )}
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8"
                                    onClick={() => handleRescheduleAppointment(appointment.id)}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-muted-foreground">
                            No appointments scheduled for today
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="all" className="mt-0 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold">All Appointments</h3>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Filter className="h-3 w-3" />
                          <span>Filter</span>
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">PATIENT</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">DATE & TIME</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">REASON</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">TYPE</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">STATUS</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">SYNCED</th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.map(appointment => (
                              <tr key={appointment.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                                      {appointment.patientName.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{appointment.patientName}</div>
                                      <div className="text-xs text-muted-foreground">{appointment.patientId}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-sm">{appointment.date}</div>
                                  <div className="text-xs text-muted-foreground">{appointment.time}</div>
                                </td>
                                <td className="py-3 px-4 text-sm">{appointment.reason}</td>
                                <td className="py-3 px-4">
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                    appointment.type === 'video' 
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' 
                                      : appointment.type === 'phone'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                  }`}>
                                    {appointment.type === 'video' && <Video className="h-3 w-3 mr-1" />}
                                    {appointment.type === 'phone' && <Phone className="h-3 w-3 mr-1" />}
                                    {appointment.type === 'in-person' && <User className="h-3 w-3 mr-1" />}
                                    <span>{appointment.type}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                    appointment.status === 'confirmed' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                      : appointment.status === 'cancelled'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                  }`}>
                                    {appointment.status}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {appointment.calendarEventId ? (
                                    <div className="inline-flex items-center text-green-600 dark:text-green-400">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      <span className="text-xs">Synced</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Not synced</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {appointment.status === 'pending' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="h-8"
                                        onClick={() => handleConfirmAppointment(appointment.id)}
                                      >
                                        Confirm
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8"
                                      onClick={() => handleRescheduleAppointment(appointment.id)}
                                    >
                                      Reschedule
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
                                      onClick={() => handleCancelAppointment(appointment.id)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold">Calendar</h3>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={prevDay}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={nextDay}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-medium">
                      {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h4>
                  </div>
                  
                  <div className="space-y-2">
                    {appointments
                      .filter(a => a.date === currentDate.toISOString().split('T')[0])
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map(appointment => (
                        <div 
                          key={appointment.id}
                          className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{appointment.time}</span>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                              appointment.type === 'video' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' 
                                : appointment.type === 'phone'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            }`}>
                              {appointment.type}
                            </div>
                          </div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">{appointment.reason}</div>
                          {appointment.calendarEventId && (
                            <div className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Synced with calendar
                            </div>
                          )}
                        </div>
                      ))}
                    
                    {appointments.filter(a => a.date === currentDate.toISOString().split('T')[0]).length === 0 && (
                      <div className="p-6 text-center text-muted-foreground">
                        No appointments for this day
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Add a new appointment to the calendar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Select
                value={newAppointment.patientId}
                onValueChange={(value) => setNewAppointment(prev => ({ ...prev, patientId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PT-1001">Nikolas Pascal</SelectItem>
                  <SelectItem value="PT-1002">Emma Rodriguez</SelectItem>
                  <SelectItem value="PT-1003">Marcus Johnson</SelectItem>
                  <SelectItem value="PT-1004">Sophia Williams</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Appointment Type</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={newAppointment.appointmentType === "in-person" ? "default" : "outline"}
                  className="flex-1 gap-1"
                  onClick={() => setNewAppointment(prev => ({ ...prev, appointmentType: "in-person" }))}
                >
                  <User className="h-4 w-4" />
                  <span>In-person</span>
                </Button>
                <Button
                  type="button"
                  variant={newAppointment.appointmentType === "video" ? "default" : "outline"}
                  className="flex-1 gap-1"
                  onClick={() => setNewAppointment(prev => ({ ...prev, appointmentType: "video" }))}
                >
                  <Video className="h-4 w-4" />
                  <span>Video</span>
                </Button>
                <Button
                  type="button"
                  variant={newAppointment.appointmentType === "phone" ? "default" : "outline"}
                  className="flex-1 gap-1"
                  onClick={() => setNewAppointment(prev => ({ ...prev, appointmentType: "phone" }))}
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  name="date"
                  value={newAppointment.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input 
                  type="time" 
                  name="time"
                  value={newAppointment.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select
                value={newAppointment.duration}
                onValueChange={(value) => setNewAppointment(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Visit</label>
              <Input 
                placeholder="Brief description of the appointment" 
                name="reason"
                value={newAppointment.reason}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea 
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[80px]"
                placeholder="Additional notes for the appointment"
                name="notes"
                value={newAppointment.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            {isSignedIn && (
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="add-to-calendar"
                  checked={syncEnabled}
                  onCheckedChange={toggleSync}
                  disabled={!isSignedIn}
                />
                <Label htmlFor="add-to-calendar">
                  Add to Google Calendar
                </Label>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAppointment}>
              Schedule Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showReminderSettingsDialog} onOpenChange={setShowReminderSettingsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reminder Settings</DialogTitle>
            <DialogDescription>
              Configure how you want to be reminded about upcoming appointments.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Email Reminders</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-reminders">Send email reminders</Label>
                  <p className="text-xs text-muted-foreground">Receive email notifications for appointments</p>
                </div>
                <Switch 
                  id="email-reminders"
                  checked={reminderSettings.emailReminders}
                  onCheckedChange={(checked) => setReminderSettings({...reminderSettings, emailReminders: checked})}
                />
              </div>
              
              {reminderSettings.emailReminders && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="email-reminder-time">Remind me</Label>
                  <Select
                    value={reminderSettings.emailReminderTime}
                    onValueChange={(value) => setReminderSettings({...reminderSettings, emailReminderTime: value})}
                  >
                    <SelectTrigger id="email-reminder-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour before</SelectItem>
                      <SelectItem value="2">2 hours before</SelectItem>
                      <SelectItem value="24">1 day before</SelectItem>
                      <SelectItem value="48">2 days before</SelectItem>
                      <SelectItem value="168">1 week before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Browser Notifications</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-reminders">Browser notifications</Label>
                  <p className="text-xs text-muted-foreground">Show popup reminders in your browser</p>
                </div>
                <Switch 
                  id="browser-reminders"
                  checked={reminderSettings.browserReminders}
                  onCheckedChange={(checked) => setReminderSettings({...reminderSettings, browserReminders: checked})}
                />
              </div>
              
              {reminderSettings.browserReminders && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="browser-reminder-time">Remind me</Label>
                  <Select
                    value={reminderSettings.browserReminderTime}
                    onValueChange={(value) => setReminderSettings({...reminderSettings, browserReminderTime: value})}
                  >
                    <SelectTrigger id="browser-reminder-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="10">10 minutes before</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Calendar Syncing</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Sync reminders with Google Calendar</p>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  When enabled, all appointments are synced with your Google Calendar
                  and will trigger reminders based on your Google Calendar settings.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowReminderSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReminderSettings}>
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPage;
