import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Heart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ActivityChart } from "@/components/patient-dashboard/ActivityChart";
import { Appointment } from '@/services/calendar/types';
import { ActivityData } from '@/hooks/patient-dashboard';

interface DashboardMainContentProps {
  healthMetrics: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    bloodOxygen: number;
    temperature: number;
  };
  upcomingAppointments: Appointment[]; // Update to use the imported Appointment type
  biologicalAge: number;
  chronologicalAge: number;
  activityData: ActivityData;
  handleSyncAllData: () => Promise<void>;
  hasConnectedApps: boolean;
  handleConfirmAppointment: (id: string) => void;
  handleRescheduleAppointment: (id: string) => void;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  healthMetrics,
  upcomingAppointments,
  biologicalAge,
  chronologicalAge,
  activityData,
  handleSyncAllData,
  hasConnectedApps,
  handleConfirmAppointment,
  handleRescheduleAppointment
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Health Metrics */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Health Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-2">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-secondary p-1.5">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">{healthMetrics.heartRate} bpm</p>
              <p className="text-sm text-muted-foreground">Heart Rate</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-secondary p-1.5">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">{healthMetrics.bloodOxygen}%</p>
              <p className="text-sm text-muted-foreground">Blood Oxygen</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-secondary p-1.5">
              <Thermometer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">{healthMetrics.temperature}°F</p>
              <p className="text-sm text-muted-foreground">Temperature</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-secondary p-1.5">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">
                {healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic}
              </p>
              <p className="text-sm text-muted-foreground">Blood Pressure</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{appointment.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleConfirmAppointment(appointment.id)}>
                    Confirm
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRescheduleAppointment(appointment.id)}>
                    Reschedule
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
          )}
        </CardContent>
      </Card>

      {/* Biological Age */}
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle>Biological Age</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-center mt-4">
            <p className="text-3xl font-semibold">{biologicalAge}</p>
            <p className="text-sm text-muted-foreground">Chronological Age: {chronologicalAge}</p>
          </div>
          <Progress value={(biologicalAge / chronologicalAge) * 100} className="w-full mt-4" />
          <p className="text-xs text-muted-foreground mt-2">
            {biologicalAge <= chronologicalAge ? "You're aging well!" : "Consider lifestyle adjustments."}
          </p>
        </CardContent>
      </Card>

      {/* Activity Tracking */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Activity Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold">{activityData.currentValue} Steps</p>
              <p className="text-sm text-muted-foreground">
                Source: {activityData.source || 'Unknown'}, Last Sync: {activityData.lastSync || 'N/A'}
              </p>
            </div>
            <Button size="sm" onClick={handleSyncAllData} disabled={!hasConnectedApps}>
              Sync Data
            </Button>
          </div>
          <ActivityChart data={activityData.data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMainContent;
