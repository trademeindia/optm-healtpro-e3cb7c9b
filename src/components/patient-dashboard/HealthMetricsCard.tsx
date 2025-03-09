
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Heart, Activity } from "lucide-react";

interface HealthMetricsCardProps {
  healthMetrics: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    bloodOxygen: number;
    temperature: number;
  };
}

export const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ healthMetrics }) => {
  return (
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
  );
};
