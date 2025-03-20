
import React from 'react';
import { useAuth } from '@/contexts/auth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CalendarDays, DollarSign, PackageCheck } from 'lucide-react';

const ReceptionistDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Receptionist Dashboard</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Welcome, {user?.name || 'Receptionist'}</span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Sign Out
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">12</div>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">23</div>
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">4</div>
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">156</div>
                    <PackageCheck className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Appointments scheduled for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Appointment list will appear here</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Check-ins</CardTitle>
                  <CardDescription>Patients who recently checked in</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Check-in list will appear here</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
