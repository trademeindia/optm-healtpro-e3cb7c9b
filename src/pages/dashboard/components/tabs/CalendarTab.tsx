
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import CalendarView from '@/components/calendar/CalendarView';
import AppointmentsList from '@/components/calendar/AppointmentsList';
import CreateAppointmentDialog from '@/components/calendar/CreateAppointmentDialog';
import { Spinner } from '@/components/ui/spinner';

const CalendarTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { 
    isLoading, 
    isAuthorized, 
    calendarData, 
    authorizeCalendar, 
    fetchEvents, 
    refreshCalendar,
    selectedDate,
    setSelectedDate,
    upcomingAppointments
  } = useCalendarIntegration();

  // Ensure appointments data is valid
  const validAppointments = upcomingAppointments || [];

  // Handle calendar connection with proper error handling
  const handleConnectCalendar = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      console.info("Starting calendar authorization process");
      await authorizeCalendar();
      console.info("Calendar authorization successful");
      toast.success("Calendar connected successfully", {
        description: "Your Google Calendar has been connected",
        duration: 3000
      });
    } catch (error) {
      console.error("Calendar connection error:", error);
      toast.error("Failed to connect calendar", {
        description: "Please try again or check your network connection",
        duration: 5000
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateAppointment = () => {
    if (!isAuthorized) {
      toast.error("Calendar not connected", {
        description: "Please connect your Google Calendar first",
        duration: 3000
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  // Safely handle refresh with error handling
  const handleRefresh = async () => {
    try {
      await refreshCalendar();
      toast.success("Calendar refreshed", {
        duration: 2000
      });
    } catch (error) {
      console.error("Error refreshing calendar:", error);
      toast.error("Failed to refresh calendar", {
        duration: 3000
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments Calendar</h2>
          <p className="text-muted-foreground">
            Manage and schedule patient appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isLoading || !isAuthorized || isConnecting}
          >
            {isLoading ? <Spinner size="sm" className="mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button onClick={handleCreateAppointment}>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Select 
                  value={selectedView} 
                  onValueChange={(value: 'day' | 'week' | 'month') => setSelectedView(value)}
                  disabled={!isAuthorized}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              {isAuthorized ? 'Your schedule and appointments' : 'Connect your calendar to view appointments'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthorized ? (
              <CalendarView 
                view={selectedView} 
                events={calendarData || []} 
                isLoading={isLoading} 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            ) : (
              <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Connect Google Calendar</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Google Calendar to manage appointments
                  </p>
                  <Button 
                    onClick={handleConnectCalendar} 
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Connecting...
                      </>
                    ) : (
                      'Connect Calendar'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your next scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsList 
                appointments={validAppointments}
                isLoading={isLoading} 
                isAuthorized={isAuthorized}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {isCreateDialogOpen && (
        <CreateAppointmentDialog 
          open={isCreateDialogOpen} 
          onClose={() => setIsCreateDialogOpen(false)}
          onCreated={() => {
            setIsCreateDialogOpen(false);
            refreshCalendar();
          }}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default CalendarTab;
