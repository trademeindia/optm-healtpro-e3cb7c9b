
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Users, PackageIcon, DollarSign } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// We'll create components for the Receptionist dashboard
import AppointmentsManagement from '@/components/receptionist/AppointmentsManagement';
import PatientManagement from '@/components/receptionist/PatientManagement';
import InventoryManagement from '@/components/receptionist/InventoryManagement';
import BillingManagement from '@/components/receptionist/BillingManagement';

const ReceptionistDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('appointments');

  return (
    <ProtectedRoute requiredRole="admin"> {/* For now, we'll use admin role for receptionist access */}
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 overflow-container">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Receptionist Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name || 'User'}
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 md:w-[600px]">
                <TabsTrigger value="appointments" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Appointments</span>
                </TabsTrigger>
                <TabsTrigger value="patients" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Patients</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <PackageIcon className="h-4 w-4" />
                  <span>Inventory</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Billing</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="appointments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AppointmentsManagement />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="patients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PatientManagement />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="inventory" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InventoryManagement />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BillingManagement />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReceptionistDashboard;
