import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Droplet, Calendar, FileText, MessageCircle, RefreshCw } from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import HealthMetric from '@/components/dashboard/HealthMetric';
import ActivityTracker from '@/components/dashboard/ActivityTracker';
import TreatmentPlan from '@/components/dashboard/TreatmentPlan';
import SymptomTracker from '@/components/dashboard/SymptomTracker';
import AnatomicalMap from '@/components/patient/AnatomicalMap';
import SymptomProgressChart from '@/components/dashboard/SymptomProgressChart';
import PostureAnalysis from '@/components/dashboard/PostureAnalysis';
import PatientReports from '@/components/patient/PatientReports';
import AppointmentsDashboard from '@/components/dashboard/AppointmentsDashboard';
import useFitnessIntegration from '@/hooks/useFitnessIntegration';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SymptomProvider } from '@/contexts/SymptomContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  const { 
    providers, 
    fitnessData, 
    refreshProviderData 
  } = useFitnessIntegration();

  // Mock data for activity tracking
  const activityData = [
    { day: 'Mon', value: 8500 },
    { day: 'Tue', value: 9200 },
    { day: 'Wed', value: 7800 },
    { day: 'Thu', value: 8100 },
    { day: 'Fri', value: 10200 },
    { day: 'Sat', value: 6500 },
    { day: 'Sun', value: 7300 }
  ];

  // Mock data for treatment tasks
  const treatmentTasks = [
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
  const upcomingAppointments = [
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

  // Function to handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    toast({
      title: "Appointment Confirmed",
      description: "Your appointment has been confirmed.",
    });
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: "Your request to reschedule has been sent.",
    });
  };

  // Function to handle sync of all health data
  const handleSyncAllData = async () => {
    const connectedProviders = providers.filter(p => p.isConnected);
    if (connectedProviders.length === 0) {
      toast({
        title: "No connected apps",
        description: "Please connect a health app to sync data.",
      });
      return;
    }

    toast({
      title: "Syncing data",
      description: "Syncing data from all connected health apps...",
    });

    // Sync data from all connected providers
    for (const provider of connectedProviders) {
      await refreshProviderData(provider.id);
    }

    toast({
      title: "Sync complete",
      description: "Your health data has been updated.",
    });
  };

  // Get health metrics from fitness data or use defaults
  const getHeartRate = () => {
    if (fitnessData.heartRate) {
      return {
        value: fitnessData.heartRate.value,
        unit: fitnessData.heartRate.unit,
        change: fitnessData.heartRate.change || 0,
        source: fitnessData.heartRate.source,
        lastSync: new Date(fitnessData.heartRate.timestamp).toLocaleTimeString()
      };
    }
    return { value: 72, unit: 'bpm', change: -3 };
  };

  const getBloodPressure = () => {
    if (fitnessData.bloodPressure) {
      return {
        value: fitnessData.bloodPressure.value,
        unit: fitnessData.bloodPressure.unit,
        change: 0,
        source: fitnessData.bloodPressure.source,
        lastSync: new Date(fitnessData.bloodPressure.timestamp).toLocaleTimeString()
      };
    }
    return { value: '120/80', unit: 'mmHg', change: 0 };
  };

  const getTemperature = () => {
    if (fitnessData.temperature) {
      return {
        value: fitnessData.temperature.value,
        unit: fitnessData.temperature.unit,
        change: fitnessData.temperature.change || 0.2,
        source: fitnessData.temperature.source,
        lastSync: new Date(fitnessData.temperature.timestamp).toLocaleTimeString()
      };
    }
    return { value: 98.6, unit: '°F', change: 0.2 };
  };

  const getOxygen = () => {
    if (fitnessData.oxygenSaturation) {
      return {
        value: fitnessData.oxygenSaturation.value,
        unit: fitnessData.oxygenSaturation.unit,
        change: fitnessData.oxygenSaturation.change || 1,
        source: fitnessData.oxygenSaturation.source,
        lastSync: new Date(fitnessData.oxygenSaturation.timestamp).toLocaleTimeString()
      };
    }
    return { value: 98, unit: '%', change: 1 };
  };

  const getSteps = () => {
    return fitnessData.steps ? {
      data: activityData,
      currentValue: Number(fitnessData.steps.value),
      source: fitnessData.steps.source,
      lastSync: new Date(fitnessData.steps.timestamp).toLocaleTimeString()
    } : { data: activityData, currentValue: 8152 };
  };

  const heartRate = getHeartRate();
  const bloodPressure = getBloodPressure();
  const temperature = getTemperature();
  const oxygen = getOxygen();
  const steps = getSteps();
  
  const hasConnectedApps = providers.some(p => p.isConnected);

  // Get current tab from URL or default to dashboard
  const getInitialTab = () => {
    if (location.hash === '#appointments') return 'appointments';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">My Health Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || 'Patient'}
            </p>
          </div>
          
          <SymptomProvider>
            <Tabs defaultValue={getInitialTab()} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="records">Medical Records</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left column */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Personal Information */}
                    <div className="glass-morphism rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{user?.name || 'Alex Johnson'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">32 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium">175 lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Height:</span>
                          <span className="font-medium">5'10"</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Blood Type:</span>
                          <span className="font-medium">O+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Primary Doctor:</span>
                          <span className="font-medium">Dr. Nikolas Pascal</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Activity Tracker with fitness data if available */}
                    <ActivityTracker
                      title="Your Activity (Steps)"
                      data={steps.data}
                      unit="steps/day"
                      currentValue={steps.currentValue}
                      source={steps.source}
                      lastSync={steps.lastSync}
                    />
                    
                    {/* Upcoming Appointments */}
                    <div className="glass-morphism rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
                      <div className="space-y-4">
                        {upcomingAppointments.map(appointment => (
                          <div key={appointment.id} className="p-3 border rounded-lg bg-card">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{appointment.type}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.date} at {appointment.time}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.doctor}
                                </p>
                              </div>
                              <div className="bg-primary/10 text-primary p-2 rounded-full">
                                <Calendar className="h-4 w-4" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs flex-1"
                                onClick={() => handleConfirmAppointment(appointment.id)}
                              >
                                Confirm
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs flex-1"
                                onClick={() => handleRescheduleAppointment(appointment.id)}
                              >
                                Reschedule
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full mt-3 text-sm">
                        View All Appointments
                      </Button>
                    </div>
                  </div>
                  
                  {/* Middle column - health metrics and treatment */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Health Data Sync Button */}
                    {hasConnectedApps && (
                      <div className="flex justify-end mb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs gap-1.5"
                          onClick={handleSyncAllData}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Sync Health Data
                        </Button>
                      </div>
                    )}
                    
                    {/* Health Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <HealthMetric
                        title="Heart Rate"
                        value={heartRate.value}
                        unit={heartRate.unit}
                        change={heartRate.change}
                        changeLabel="vs last week"
                        icon={<Heart className="w-4 h-4" />}
                        color="bg-medical-red/10 text-medical-red"
                        source={heartRate.source}
                        lastSync={heartRate.lastSync}
                        isConnected={!!heartRate.source}
                      />
                      
                      <HealthMetric
                        title="Blood Pressure"
                        value={bloodPressure.value}
                        unit={bloodPressure.unit}
                        change={bloodPressure.change}
                        changeLabel="stable"
                        icon={<Activity className="w-4 h-4" />}
                        color="bg-medical-blue/10 text-medical-blue"
                        source={bloodPressure.source}
                        lastSync={bloodPressure.lastSync}
                        isConnected={!!bloodPressure.source}
                      />
                      
                      <HealthMetric
                        title="Temperature"
                        value={temperature.value}
                        unit={temperature.unit}
                        change={temperature.change}
                        changeLabel="vs yesterday"
                        icon={<Thermometer className="w-4 h-4" />}
                        color="bg-medical-yellow/10 text-medical-yellow"
                        source={temperature.source}
                        lastSync={temperature.lastSync}
                        isConnected={!!temperature.source}
                      />
                      
                      <HealthMetric
                        title="Oxygen"
                        value={oxygen.value}
                        unit={oxygen.unit}
                        change={oxygen.change}
                        changeLabel="vs last check"
                        icon={<Droplet className="w-4 h-4" />}
                        color="bg-medical-green/10 text-medical-green"
                        source={oxygen.source}
                        lastSync={oxygen.lastSync}
                        isConnected={!!oxygen.source}
                      />
                    </div>
                    
                    {/* Treatment Plan */}
                    <TreatmentPlan
                      title="Today's Treatment Plan"
                      date="Jun 15, 2023"
                      tasks={treatmentTasks}
                      progress={50}
                    />
                    
                    {/* PostureAnalysis Component */}
                    <PostureAnalysis />
                    
                    {/* Symptom Progress Chart with better integration */}
                    <div className="glass-morphism rounded-2xl p-6">
                      <SymptomProgressChart />
                    </div>
                  </div>
                  
                  {/* Right column - symptom tracker, documents, messages */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Symptom Tracker - Now connected via SymptomContext */}
                    <SymptomTracker />
                    
                    {/* Anatomical Map - Now connected via SymptomContext */}
                    <AnatomicalMap />
                    
                    {/* Medical Documents */}
                    <div className="glass-morphism rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Medical Documents</h3>
                        <Button variant="ghost" size="sm" className="text-primary">
                          View All
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">MRI Results</h4>
                              <p className="text-xs text-muted-foreground">May 28, 2023</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M12 3v13"></path>
                              <path d="m17 11-5 5-5-5"></path>
                              <path d="M5 21h14"></path>
                            </svg>
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Blood Test Results</h4>
                              <p className="text-xs text-muted-foreground">Jun 10, 2023</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M12 3v13"></path>
                              <path d="m17 11-5 5-5-5"></path>
                              <path d="M5 21h14"></path>
                            </svg>
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Treatment Plan PDF</h4>
                              <p className="text-xs text-muted-foreground">Jun 15, 2023</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M12 3v13"></path>
                              <path d="m17 11-5 5-5-5"></path>
                              <path d="M5 21h14"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Message Your Doctor */}
                    <div className="glass-morphism rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Message Your Doctor</h3>
                        <Button variant="ghost" size="sm" className="text-primary">
                          View History
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <textarea 
                          className="w-full p-3 h-24 rounded-lg border resize-none bg-white/80 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary" 
                          placeholder="Type your message here..."
                        ></textarea>
                        <Button className="w-full flex items-center justify-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>Send Message</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appointments">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-6">Your Appointments</h2>
                  <AppointmentsDashboard 
                    unreadMessages={3}
                    nextAppointment={{
                      date: 'June 20, 2023',
                      time: '10:30 AM',
                      doctor: 'Dr. Nikolas Pascal',
                      type: 'Follow-up Consultation'
                    }}
                  />
                  
                  <h3 className="text-xl font-semibold mt-10 mb-4">Scheduled Appointments</h3>
                  <div className="glass-morphism rounded-2xl p-6">
                    <div className="space-y-4">
                      {upcomingAppointments.map(appointment => (
                        <div key={appointment.id} className="p-4 border rounded-lg bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-base">{appointment.type}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {appointment.date} at {appointment.time}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 self-end md:self-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleConfirmAppointment(appointment.id)}
                            >
                              Confirm
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRescheduleAppointment(appointment.id)}
                            >
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="progress">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>
                  <div className="glass-morphism rounded-2xl p-6">
                    <SymptomProgressChart />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="records">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-6">Medical Records</h2>
                  <div className="glass-morphism rounded-2xl p-6">
                    <PatientReports />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </SymptomProvider>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
