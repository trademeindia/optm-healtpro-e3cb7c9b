
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import PatientDashboardTabs from '@/components/patient-dashboard/PatientDashboardTabs';
import UpcomingAppointmentsCard from '@/components/patient-dashboard/UpcomingAppointmentsCard';
import { useAppointments } from '@/hooks/dashboard/useAppointments';
import { useAuth } from '@/contexts/auth';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { upcomingAppointments, handleConfirmAppointment, handleRescheduleAppointment } = useAppointments();
  
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <Card className="shadow-sm border">
        <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name ? `${user.name}'s Dashboard` : 'Patient Dashboard'}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your appointments, messages, and health information
              </p>
            </div>
            <div className="bg-primary/10 text-primary rounded-full h-10 w-10 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PatientDashboardTabs />
            </div>
            <div>
              <UpcomingAppointmentsCard 
                upcomingAppointments={upcomingAppointments.map(apt => ({
                  id: apt.id,
                  date: new Date(apt.date).toLocaleDateString(),
                  time: apt.time,
                  doctor: apt.provider.name,
                  type: apt.type
                }))}
                onConfirmAppointment={handleConfirmAppointment}
                onRescheduleAppointment={handleRescheduleAppointment}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
