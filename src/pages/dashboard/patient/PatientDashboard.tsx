
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Calendar, PieChart, Pill, Activity, Map, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { EnsureVisible } from '@/components/ui/ensure-visible';
import DashboardOverview from '@/components/patient-dashboard/DashboardOverview';
import SymptomTracker from '@/components/patient-dashboard/SymptomTracker';
import MedicationManager from '@/components/patient-dashboard/MedicationManager';
import AnatomicalView from '@/components/patient-dashboard/AnatomicalView';
import AppointmentManager from '@/components/patient-dashboard/AppointmentManager';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <EnsureVisible className="container mx-auto py-6 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {user?.name || 'Patient'}
            </h1>
            <p className="text-muted-foreground">
              Your health dashboard and personalized care plan
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="shadow-sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Log Symptom
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 grid grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              <span className="hidden sm:inline">Medications</span>
            </TabsTrigger>
            <TabsTrigger value="anatomical" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Anatomical</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="symptoms" className="space-y-4 animate-in fade-in duration-300">
            <SymptomTracker />
          </TabsContent>

          <TabsContent value="medications" className="space-y-4 animate-in fade-in duration-300">
            <MedicationManager />
          </TabsContent>
          
          <TabsContent value="anatomical" className="space-y-4 animate-in fade-in duration-300">
            <AnatomicalView />
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4 animate-in fade-in duration-300">
            <AppointmentManager />
          </TabsContent>
        </Tabs>
      </motion.div>
    </EnsureVisible>
  );
};

export default PatientDashboard;
