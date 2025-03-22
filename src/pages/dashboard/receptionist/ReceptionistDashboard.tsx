
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { CalendarRange, Users, DollarSign, Clipboard, Mail } from 'lucide-react';

const ReceptionistDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Receptionist'}</h1>
          <p className="text-muted-foreground">Your clinic management dashboard</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline">View Schedule</Button>
          <Button>New Appointment</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-4">
                <CalendarRange className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <h3 className="text-2xl font-bold">15</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-4">
                <Users className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patients Checked In</p>
                <h3 className="text-2xl font-bold">8</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-orange-700 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <h3 className="text-2xl font-bold">5</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-4">
                <Mail className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Messages</p>
                <h3 className="text-2xl font-bold">3</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Schedule for {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground [&>th]:py-3 [&>th]:px-2">
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Provider</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {time: '9:00 AM', patient: 'John Smith', provider: 'Dr. Wilson', type: 'Follow-up', status: 'Checked In'},
                    {time: '9:30 AM', patient: 'Sarah Johnson', provider: 'Dr. Martinez', type: 'Initial Consultation', status: 'Arrived'},
                    {time: '10:15 AM', patient: 'Michael Lee', provider: 'Dr. Wilson', type: 'Physical Therapy', status: 'In Progress'},
                    {time: '11:00 AM', patient: 'Emma Davis', provider: 'Dr. Garcia', type: 'Follow-up', status: 'Scheduled'},
                    {time: '1:30 PM', patient: 'Robert Brown', provider: 'Dr. Martinez', type: 'Post-Op Check', status: 'Scheduled'},
                  ].map((appt, i) => (
                    <tr key={i} className="text-sm [&>td]:py-3 [&>td]:px-2">
                      <td>{appt.time}</td>
                      <td>{appt.patient}</td>
                      <td>{appt.provider}</td>
                      <td>{appt.type}</td>
                      <td>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          appt.status === 'Checked In' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          appt.status === 'Arrived' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                          appt.status === 'In Progress' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <CalendarRange className="mr-2 h-4 w-4" /> Schedule Appointment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" /> Register Patient
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" /> Process Payment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clipboard className="mr-2 h-4 w-4" /> Check In Patient
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>View and manage patient information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="waitingRoom">Waiting Room</TabsTrigger>
                <TabsTrigger value="formsPending">Forms Pending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                <div className="flex items-center justify-between pb-3">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="px-3 py-2 border rounded-md w-full max-w-xs"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">Add Patient</Button>
                  </div>
                </div>
                
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground [&>th]:py-3 [&>th]:px-2">
                      <th>Patient</th>
                      <th>Next Appointment</th>
                      <th>Provider</th>
                      <th>Insurance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      {name: 'James Wilson', date: 'Jun 15, 2023', time: '2:30 PM', provider: 'Dr. Garcia', insurance: 'Blue Cross'},
                      {name: 'Jennifer Adams', date: 'Jun 16, 2023', time: '10:00 AM', provider: 'Dr. Wilson', insurance: 'Medicare'},
                      {name: 'Thomas Clark', date: 'Jun 16, 2023', time: '3:15 PM', provider: 'Dr. Martinez', insurance: 'Aetna'},
                      {name: 'Rebecca White', date: 'Jun 17, 2023', time: '9:45 AM', provider: 'Dr. Wilson', insurance: 'United Health'},
                    ].map((patient, i) => (
                      <tr key={i} className="text-sm [&>td]:py-3 [&>td]:px-2">
                        <td>{patient.name}</td>
                        <td>{patient.date}, {patient.time}</td>
                        <td>{patient.provider}</td>
                        <td>{patient.insurance}</td>
                        <td className="flex gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>
              
              <TabsContent value="waitingRoom" className="space-y-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground [&>th]:py-3 [&>th]:px-2">
                      <th>Patient</th>
                      <th>Checked In</th>
                      <th>Appointment</th>
                      <th>Wait Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      {name: 'Sarah Johnson', time: '9:15 AM', appointment: '9:30 AM', waitTime: '15 min'},
                      {name: 'Michael Lee', time: '9:45 AM', appointment: '10:15 AM', waitTime: '30 min'},
                    ].map((patient, i) => (
                      <tr key={i} className="text-sm [&>td]:py-3 [&>td]:px-2">
                        <td>{patient.name}</td>
                        <td>{patient.time}</td>
                        <td>{patient.appointment}</td>
                        <td>{patient.waitTime}</td>
                        <td>
                          <Button variant="ghost" size="sm">Alert Provider</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>
              
              <TabsContent value="formsPending" className="space-y-4">
                <p className="text-center py-8 text-muted-foreground">No forms pending completion</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
