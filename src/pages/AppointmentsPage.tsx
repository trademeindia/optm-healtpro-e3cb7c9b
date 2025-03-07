
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, Clock, User, Plus, Search, 
  ChevronLeft, ChevronRight, Filter, MoreHorizontal, 
  Video, Phone
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();

  // Sample appointment data
  const appointments = [
    {
      id: 1,
      patientName: "Nikolas Pascal",
      patientId: "PT-1001",
      reason: "Follow-up appointment",
      date: "2023-06-22",
      time: "09:00 AM - 09:30 AM",
      type: "in-person",
      status: "confirmed"
    },
    {
      id: 2,
      patientName: "Emma Rodriguez",
      patientId: "PT-1002",
      reason: "Pain management consultation",
      date: "2023-06-22",
      time: "11:15 AM - 12:00 PM",
      type: "video",
      status: "confirmed"
    },
    {
      id: 3,
      patientName: "Marcus Johnson",
      patientId: "PT-1003",
      reason: "Rehabilitation session",
      date: "2023-06-22",
      time: "02:30 PM - 03:15 PM",
      type: "in-person",
      status: "confirmed"
    },
    {
      id: 4,
      patientName: "Sophia Williams",
      patientId: "PT-1004",
      reason: "Initial consultation",
      date: "2023-06-23",
      time: "10:00 AM - 11:00 AM",
      type: "phone",
      status: "pending"
    },
    {
      id: 5,
      patientName: "Emma Rodriguez",
      patientId: "PT-1002",
      reason: "Medication review",
      date: "2023-06-24",
      time: "09:30 AM - 10:00 AM",
      type: "in-person",
      status: "confirmed"
    }
  ];

  // Filter appointments
  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= new Date());
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  
  const handleAddAppointment = () => {
    toast({
      title: "Appointment Scheduled",
      description: "The appointment has been successfully scheduled.",
    });
    setShowAddDialog(false);
  };

  const handleConfirmAppointment = (id: number) => {
    toast({
      title: "Appointment Confirmed",
      description: `Appointment #${id} has been confirmed.`,
    });
  };

  const handleRescheduleAppointment = (id: number) => {
    toast({
      title: "Reschedule Initiated",
      description: `You can now reschedule appointment #${id}.`,
    });
  };

  const handleCancelAppointment = (id: number) => {
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
                  className="gap-1.5" 
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">New Appointment</span>
                </Button>
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
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                  }`}>
                                    {appointment.status}
                                  </div>
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
              <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <option value="">Select a patient</option>
                <option value="1">Nikolas Pascal</option>
                <option value="2">Emma Rodriguez</option>
                <option value="3">Marcus Johnson</option>
                <option value="4">Sophia Williams</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Appointment Type</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-1"
                >
                  <User className="h-4 w-4" />
                  <span>In-person</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-1"
                >
                  <Video className="h-4 w-4" />
                  <span>Video</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-1"
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input type="time" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Visit</label>
              <Input placeholder="Brief description of the appointment" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea 
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[80px]"
                placeholder="Additional notes for the appointment"
              ></textarea>
            </div>
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
    </div>
  );
};

export default AppointmentsPage;
