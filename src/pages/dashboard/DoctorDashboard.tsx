
import React from 'react';
import { useAuth } from '@/contexts/auth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, CalendarDays, BarChart2 } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Welcome, {user?.name || 'Doctor'}</span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Sign Out
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">42</div>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">8</div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">5</div>
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Patient Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">76%</div>
                    <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>Your most recently viewed patient records</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Patient list will appear here</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled appointments for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Appointment list will appear here</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
