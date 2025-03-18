
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, HeartPulse, Thermometer, Droplet, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { HealthMetrics } from '@/hooks/dashboard/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';

interface RealTimeVitalsProps {
  healthMetrics: HealthMetrics;
  hasConnectedApps: boolean;
  onSyncData: () => void;
}

const RealTimeVitals: React.FC<RealTimeVitalsProps> = ({
  healthMetrics,
  hasConnectedApps,
  onSyncData
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Sample heart rate data for 24 hours
  const heartRateData = [
    { time: '00:00', rate: 62 }, { time: '01:00', rate: 60 }, { time: '02:00', rate: 58 },
    { time: '03:00', rate: 57 }, { time: '04:00', rate: 56 }, { time: '05:00', rate: 58 },
    { time: '06:00', rate: 65 }, { time: '07:00', rate: 72 }, { time: '08:00', rate: 78 },
    { time: '09:00', rate: 82 }, { time: '10:00', rate: 76 }, { time: '11:00', rate: 74 },
    { time: '12:00', rate: 78 }, { time: '13:00', rate: 80 }, { time: '14:00', rate: 74 },
    { time: '15:00', rate: 72 }, { time: '16:00', rate: 76 }, { time: '17:00', rate: 82 },
    { time: '18:00', rate: 84 }, { time: '19:00', rate: 78 }, { time: '20:00', rate: 74 },
    { time: '21:00', rate: 70 }, { time: '22:00', rate: 68 }, { time: '23:00', rate: 64 }
  ];
  
  // Sample blood pressure data
  const bloodPressureData = [
    { time: '06:00', systolic: 118, diastolic: 76 },
    { time: '09:00', systolic: 122, diastolic: 78 },
    { time: '12:00', systolic: 120, diastolic: 80 },
    { time: '15:00', systolic: 124, diastolic: 82 },
    { time: '18:00', systolic: 126, diastolic: 84 },
    { time: '21:00', systolic: 118, diastolic: 78 }
  ];
  
  // Oxygen level data for 24 hours
  const oxygenData = [
    { time: '00:00', level: 96 }, { time: '03:00', level: 97 },
    { time: '06:00', level: 98 }, { time: '09:00', level: 98 },
    { time: '12:00', level: 97 }, { time: '15:00', level: 96 },
    { time: '18:00', level: 97 }, { time: '21:00', level: 96 }
  ];
  
  // Alerts
  const vitalAlerts = [
    { id: 1, time: '2023-06-14 08:45', message: 'Heart rate elevated to 105 bpm during exercise', severity: 'info' },
    { id: 2, time: '2023-06-13 22:30', message: 'Blood pressure above threshold: 135/88 mmHg', severity: 'warning' },
    { id: 3, time: '2023-06-12 15:20', message: 'Normal readings resumed after medication', severity: 'success' }
  ];
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onSyncData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Real-Time Vitals</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Last updated: {format(new Date(), 'h:mm a')}
          </span>
          <Button 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing || !hasConnectedApps}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <HeartPulse className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs text-muted-foreground">5 min ago</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Heart Rate</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{healthMetrics.heartRate.value}</span>
              <span className="text-sm ml-1 text-muted-foreground">bpm</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className={healthMetrics.heartRate.change > 0 ? "text-rose-500" : "text-emerald-500"}>
                {healthMetrics.heartRate.change > 0 ? "↑" : "↓"} {Math.abs(healthMetrics.heartRate.change)}%
              </span> from yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <Activity className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-xs text-muted-foreground">15 min ago</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Blood Pressure</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">{healthMetrics.bloodPressure.value}</span>
              <span className="text-sm ml-1 text-muted-foreground">mmHg</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className={healthMetrics.bloodPressure.change > 0 ? "text-rose-500" : "text-emerald-500"}>
                {healthMetrics.bloodPressure.change > 0 ? "↑" : "↓"} {Math.abs(healthMetrics.bloodPressure.change)}%
              </span> from yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                <Droplet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs text-muted-foreground">20 min ago</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Oxygen Saturation</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{healthMetrics.oxygen.value}</span>
              <span className="text-sm ml-1 text-muted-foreground">%</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className={healthMetrics.oxygen.change > 0 ? "text-emerald-500" : "text-rose-500"}>
                {healthMetrics.oxygen.change > 0 ? "↑" : "↓"} {Math.abs(healthMetrics.oxygen.change)}%
              </span> from yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Thermometer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-xs text-muted-foreground">10 min ago</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Temperature</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">{healthMetrics.temperature.value}</span>
              <span className="text-sm ml-1 text-muted-foreground">°F</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className={healthMetrics.temperature.change > 0 ? "text-rose-500" : "text-emerald-500"}>
                {healthMetrics.temperature.change > 0 ? "↑" : "↓"} {Math.abs(healthMetrics.temperature.change)}%
              </span> from yesterday
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Heart Rate (24 Hours)</CardTitle>
            <CardDescription>Continuous monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heartRateData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[50, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Heart Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Min: 56 bpm</span>
              <span>Avg: 71 bpm</span>
              <span>Max: 84 bpm</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Blood Pressure</CardTitle>
            <CardDescription>Systolic & Diastolic measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bloodPressureData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[60, 140]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Systolic"
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Diastolic"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Last Reading: 118/78 mmHg</span>
              <span>Average: 121/80 mmHg</span>
              <span>Status: Normal</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts & Oxygen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-primary" />
              Vital Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vitalAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800' :
                    alert.severity === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800' :
                    'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800'
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{alert.message}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{alert.time}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Notification Settings</h3>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You are currently receiving alerts for critical values and significant changes in vitals.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Oxygen Saturation</CardTitle>
            <CardDescription>24-hour monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oxygenData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[90, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="level"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="O2 Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium mb-1">Oxygen Saturation Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Your oxygen levels remain within the healthy range of 96-98%. No significant drops
                were detected during sleep hours.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeVitals;
