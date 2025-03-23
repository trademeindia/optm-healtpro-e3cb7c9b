
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Calendar, PieChart, Pill, Activity, Map, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import DashboardMainContent from '@/components/patient-dashboard/DashboardMainContent';
import PatientDashboardTabs from '@/components/patient-dashboard/PatientDashboardTabs';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 visible-content"
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="visible-content">
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
            <Card className="shadow-sm border bg-card visible-card">
              <CardContent className="p-6 visible-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-3 md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Health Summary</h3>
                    <p className="text-muted-foreground mb-6">
                      Your health data is displayed here. Connect your health devices 
                      to see more detailed information.
                    </p>
                    <Button>Connect Health App</Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 visible-content">
              <Card className="shadow-sm border bg-card visible-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You have no upcoming appointments</p>
                    <Button variant="outline" size="sm" className="mt-4">Schedule Now</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border bg-card visible-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Recent Symptoms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No recent symptoms reported</p>
                    <Button variant="outline" size="sm" className="mt-4">Record Symptoms</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border bg-card visible-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Treatment Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No active treatment plans</p>
                    <Button variant="outline" size="sm" className="mt-4">View Recommendations</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="symptoms" className="space-y-4 animate-in fade-in duration-300">
            <Card className="shadow-sm border visible-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Symptom Tracker</h3>
                <p className="text-muted-foreground mb-6">Track and manage your symptoms over time</p>
                <Button>Record New Symptom</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4 animate-in fade-in duration-300">
            <Card className="shadow-sm border visible-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Medication Management</h3>
                <p className="text-muted-foreground mb-6">Track your medications and set reminders</p>
                <Button>Add Medication</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="anatomical" className="space-y-4 animate-in fade-in duration-300">
            <Card className="shadow-sm border visible-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Anatomical View</h3>
                <p className="text-muted-foreground mb-6">Explore your body's health status</p>
                <Button>Open Anatomical Map</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4 animate-in fade-in duration-300">
            <Card className="shadow-sm border visible-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Appointment Management</h3>
                <p className="text-muted-foreground mb-6">Schedule and manage your appointments</p>
                <Button>Book New Appointment</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default PatientDashboard;
