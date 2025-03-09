
import React from 'react';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppointmentsHeaderProps {
  isLoading: boolean;
  calendarConnected: boolean;
  onRefresh: () => void;
  onConnectCalendar: () => void;
  onNewAppointment: () => void;
}

const AppointmentsHeader: React.FC<AppointmentsHeaderProps> = ({
  isLoading,
  calendarConnected,
  onRefresh,
  onConnectCalendar,
  onNewAppointment
}) => {
  return (
    <div className="mb-6 pl-10 lg:pl-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your Appointments</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your upcoming appointments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          
          {!calendarConnected && (
            <Button variant="outline" size="sm" onClick={onConnectCalendar}>
              <Calendar className="h-4 w-4 mr-2" />
              Connect Calendar
            </Button>
          )}
          
          <Button onClick={onNewAppointment}>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsHeader;
