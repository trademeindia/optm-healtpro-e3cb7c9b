
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { CalendarRange, Users, Activity, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToMotionAnalysis = () => {
    navigate('/dashboard/doctor/motion-analysis');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, Dr. {user?.name?.split(' ')[1] || user?.name || 'User'}</h1>
          <p className="text-muted-foreground">Your clinical dashboard and patient management portal</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline">View Schedule</Button>
          <Button>New Patient</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-4">
                <Users className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-4">
                <CalendarRange className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <h3 className="text-2xl font-bold">3</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-orange-700 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
                <h3 className="text-2xl font-bold">7</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-4">
                <Activity className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Motion Analyses</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="bg-gray-100 dark:bg-gray-800 text-center p-2 rounded-md min-w-[60px]">
                      <div className="text-sm text-muted-foreground">
                        {index === 0 ? '9:00' : index === 1 ? '11:30' : '15:15'}
                      </div>
                      <div className="text-sm font-medium">
                        {index === 0 ? 'AM' : index === 1 ? 'AM' : 'PM'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {index === 0 ? 'John Smith' : index === 1 ? 'Emily Johnson' : 'Michael Davis'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {index === 0 ? 'Follow-up Consultation' : index === 1 ? 'Motion Analysis' : 'Initial Assessment'}
                      </p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleNavigateToMotionAnalysis} className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" /> Motion Analysis
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="mr-2 h-4 w-4" /> Schedule Appointment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Create Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" /> Patient List
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Patients you've recently treated</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground [&>th]:py-3 [&>th]:px-2">
                      <th>Patient</th>
                      <th>Last Visit</th>
                      <th>Diagnosis</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <tr key={i} className="text-sm [&>td]:py-3 [&>td]:px-2">
                        <td>{['John Smith', 'Emily Johnson', 'Michael Davis', 'Sarah Wong', 'David Garcia'][i]}</td>
                        <td>{['Jun 12, 2023', 'Jun 10, 2023', 'Jun 8, 2023', 'Jun 5, 2023', 'Jun 1, 2023'][i]}</td>
                        <td>{['Lower Back Pain', 'Knee Rehabilitation', 'Shoulder Injury', 'Postural Assessment', 'Hip Replacement Follow-up'][i]}</td>
                        <td>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            i % 3 === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            i % 3 === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Follow-up' : 'Completed'}
                          </span>
                        </td>
                        <td>
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>
              
              <TabsContent value="follow-up" className="text-center py-8">
                <p className="text-muted-foreground">No follow-up patients to display</p>
              </TabsContent>
              
              <TabsContent value="new" className="text-center py-8">
                <p className="text-muted-foreground">No new patients to display</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
