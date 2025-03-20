
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Heart, Activity, Thermometer, Droplet, Moon, BarChart as BarChartIcon, Clock, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthData } from '@/hooks/useHealthData';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface TrendProps {
  value: number;
  trend: 'up' | 'down' | 'stable';
  isPositive?: boolean;
}

interface ComprehensiveHealthDashboardProps {
  healthData: HealthData | null;
  isLoading: boolean;
  lastSynced: Date | null;
  onSyncClick: () => Promise<boolean>;
}

const TrendIndicator = ({ value, trend, isPositive = true }: TrendProps) => {
  const getColor = () => {
    if ((trend === 'up' && isPositive) || (trend === 'down' && !isPositive)) {
      return 'text-green-500';
    }
    else if ((trend === 'down' && isPositive) || (trend === 'up' && !isPositive)) {
      return 'text-red-500';
    }
    return 'text-gray-500';
  };

  const getSymbol = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <span className={`flex items-center ${getColor()}`}>
      {getSymbol()} {Math.abs(value)}%
    </span>
  );
};

const ComprehensiveHealthDashboard: React.FC<ComprehensiveHealthDashboardProps> = ({ 
  healthData, 
  isLoading, 
  lastSynced, 
  onSyncClick 
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Activity className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">No Health Data Available</h3>
        <p className="mb-4 text-muted-foreground">
          Connect with Google Fit or sync your health device to view your health metrics.
        </p>
        <Button onClick={() => onSyncClick()}>Sync Health Data</Button>
      </div>
    );
  }

  const getTrendText = (trend: 'up' | 'down' | 'stable', change: number, metric: string, isPositive = true) => {
    if (trend === 'stable') {
      return `Your ${metric} has remained stable.`;
    }

    const direction = trend === 'up' ? 'increased' : 'decreased';
    const sentiment = (trend === 'up' && isPositive) || (trend === 'down' && !isPositive) 
      ? 'positive' 
      : ((trend === 'up' && !isPositive) || (trend === 'down' && isPositive) ? 'concerning' : 'neutral');
    
    return `Your ${metric} has ${direction} by ${Math.abs(change)}%. This is a ${sentiment} trend.`;
  };

  const lastSyncedText = lastSynced 
    ? `Last updated: ${lastSynced.toLocaleTimeString()} ${lastSynced.toLocaleDateString()}`
    : 'Not yet synced';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Health Dashboard</h2>
          <p className="text-muted-foreground">{lastSyncedText}</p>
        </div>
        <Button onClick={() => onSyncClick()} className="mt-2 sm:mt-0">
          Sync Health Data
        </Button>
      </div>

      {/* Vital Signs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-baseline">
              {healthData.vitalSigns.heartRate.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">bpm</span>
              <Badge variant="outline" className="ml-2">
                {healthData.vitalSigns.heartRate.trend && healthData.vitalSigns.heartRate.change ? (
                  <TrendIndicator 
                    value={healthData.vitalSigns.heartRate.change} 
                    trend={healthData.vitalSigns.heartRate.trend}
                    isPositive={false}
                  />
                ) : 'Stable'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthData.vitalSigns.heartRate.trend && healthData.vitalSigns.heartRate.change
                ? getTrendText(healthData.vitalSigns.heartRate.trend, healthData.vitalSigns.heartRate.change, 'heart rate', false)
                : 'Your heart rate is within normal range.'}
            </p>
          </CardContent>
        </Card>

        {/* Blood Pressure Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-baseline">
              {healthData.vitalSigns.bloodPressure.systolic}/{healthData.vitalSigns.bloodPressure.diastolic}
              <span className="text-sm font-normal text-muted-foreground ml-1">mmHg</span>
              <Badge variant="outline" className="ml-2">
                {healthData.vitalSigns.bloodPressure.trend && healthData.vitalSigns.bloodPressure.change ? (
                  <TrendIndicator 
                    value={healthData.vitalSigns.bloodPressure.change} 
                    trend={healthData.vitalSigns.bloodPressure.trend}
                    isPositive={false}
                  />
                ) : 'Stable'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthData.vitalSigns.bloodPressure.trend && healthData.vitalSigns.bloodPressure.change
                ? getTrendText(healthData.vitalSigns.bloodPressure.trend, healthData.vitalSigns.bloodPressure.change, 'blood pressure', false)
                : 'Your blood pressure is within normal range.'}
            </p>
          </CardContent>
        </Card>

        {/* Body Temperature Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Body Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-baseline">
              {healthData.vitalSigns.bodyTemperature.value.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">°F</span>
              <Badge variant="outline" className="ml-2">
                {healthData.vitalSigns.bodyTemperature.trend && healthData.vitalSigns.bodyTemperature.change ? (
                  <TrendIndicator 
                    value={healthData.vitalSigns.bodyTemperature.change} 
                    trend={healthData.vitalSigns.bodyTemperature.trend}
                    isPositive={false}
                  />
                ) : 'Stable'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthData.vitalSigns.bodyTemperature.trend && healthData.vitalSigns.bodyTemperature.change
                ? getTrendText(healthData.vitalSigns.bodyTemperature.trend, healthData.vitalSigns.bodyTemperature.change, 'temperature', false)
                : 'Your body temperature is normal.'}
            </p>
          </CardContent>
        </Card>

        {/* Oxygen Saturation Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oxygen Saturation</CardTitle>
            <Droplet className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-baseline">
              {healthData.vitalSigns.oxygenSaturation.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">%</span>
              <Badge variant="outline" className="ml-2">
                {healthData.vitalSigns.oxygenSaturation.trend && healthData.vitalSigns.oxygenSaturation.change ? (
                  <TrendIndicator 
                    value={healthData.vitalSigns.oxygenSaturation.change} 
                    trend={healthData.vitalSigns.oxygenSaturation.trend}
                    isPositive={true}
                  />
                ) : 'Stable'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthData.vitalSigns.oxygenSaturation.trend && healthData.vitalSigns.oxygenSaturation.change
                ? getTrendText(healthData.vitalSigns.oxygenSaturation.trend, healthData.vitalSigns.oxygenSaturation.change, 'oxygen saturation', true)
                : 'Your oxygen levels are within normal range.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Tabs */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Health Metrics Over Time</CardTitle>
            <Tabs defaultValue={timeRange} onValueChange={(v) => setTimeRange(v as 'week' | 'month' | 'year')}>
              <TabsList>
                <TabsTrigger value="week" className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Week</span>
                </TabsTrigger>
                <TabsTrigger value="month" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Month</span>
                </TabsTrigger>
                <TabsTrigger value="year" className="flex items-center">
                  <BarChartIcon className="h-4 w-4 mr-1" />
                  <span>Year</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="week" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData.trends?.weekly || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate (bpm)" stroke="#6366f1" activeDot={{ r: 8 }} />
                  <Line yAxisId="left" type="monotone" dataKey="bloodPressureSystolic" name="Systolic (mmHg)" stroke="#f43f5e" />
                  <Line yAxisId="left" type="monotone" dataKey="bloodPressureDiastolic" name="Diastolic (mmHg)" stroke="#ec4899" />
                  <Line yAxisId="right" type="monotone" dataKey="oxygenSaturation" name="Oxygen (%)" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="month" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData.trends?.monthly || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                  <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate (bpm)" stroke="#6366f1" />
                  <Line yAxisId="left" type="monotone" dataKey="bloodPressureSystolic" name="Systolic (mmHg)" stroke="#f43f5e" />
                  <Line yAxisId="left" type="monotone" dataKey="bloodPressureDiastolic" name="Diastolic (mmHg)" stroke="#ec4899" />
                  <Line yAxisId="right" type="monotone" dataKey="oxygenSaturation" name="Oxygen (%)" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="year" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData.trends?.yearly || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate (bpm)" stroke="#6366f1" />
                  <Line yAxisId="left" type="monotone" dataKey="bloodPressureSystolic" name="Systolic (mmHg)" stroke="#f43f5e" />
                  <Line yAxisId="left" type="monotone" dataKey="bloodPressureDiastolic" name="Diastolic (mmHg)" stroke="#ec4899" />
                  <Line yAxisId="right" type="monotone" dataKey="oxygenSaturation" name="Oxygen (%)" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </CardContent>
      </Card>

      {/* Activity and Sleep Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-indigo-500" />
              Activity Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Steps</p>
                <p className="text-xl font-bold">{healthData.activity.steps.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Distance</p>
                <p className="text-xl font-bold">{healthData.activity.distance} km</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Calories</p>
                <p className="text-xl font-bold">{healthData.activity.caloriesBurned}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Minutes</p>
                <p className="text-xl font-bold">{healthData.activity.activeMinutes}</p>
              </div>
            </div>
            <div className="mt-4 h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthData.trends?.weekly || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="steps" name="Steps" fill="#6366f1" maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="h-5 w-5 mr-2 text-indigo-500" />
              Sleep Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sleep</p>
                  <p className="text-xl font-bold">{healthData.sleep.duration} hrs</p>
                </div>
                <div className="bg-muted p-2 rounded-full">
                  <Badge variant={
                    healthData.sleep.quality === 'excellent' ? 'default' :
                    healthData.sleep.quality === 'good' ? 'secondary' :
                    healthData.sleep.quality === 'fair' ? 'outline' : 'destructive'
                  }>
                    {healthData.sleep.quality}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Deep Sleep</p>
                  <p className="text-lg font-bold">{healthData.sleep.deepSleep} hrs</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">REM Sleep</p>
                  <p className="text-lg font-bold">{healthData.sleep.remSleep} hrs</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Light Sleep</p>
                  <p className="text-lg font-bold">{healthData.sleep.lightSleep} hrs</p>
                </div>
              </div>

              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Deep', hours: healthData.sleep.deepSleep, fill: '#3730a3' },
                      { name: 'REM', hours: healthData.sleep.remSleep, fill: '#6366f1' },
                      { name: 'Light', hours: healthData.sleep.lightSleep, fill: '#a5b4fc' }
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Insights Card */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>AI Health Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 bg-green-100 p-1.5 rounded-full text-green-600">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Cardiovascular Health</h4>
                <p className="text-sm text-muted-foreground">
                  Your heart rate of {healthData.vitalSigns.heartRate.value} bpm and blood pressure of {healthData.vitalSigns.bloodPressure.systolic}/{healthData.vitalSigns.bloodPressure.diastolic} mmHg indicate good cardiovascular health.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-0.5 bg-green-100 p-1.5 rounded-full text-green-600">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Respiratory Function</h4>
                <p className="text-sm text-muted-foreground">
                  Your oxygen saturation of {healthData.vitalSigns.oxygenSaturation.value}% suggests healthy lung function and good oxygen transport through your bloodstream.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-0.5 bg-green-100 p-1.5 rounded-full text-green-600">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Physical Activity</h4>
                <p className="text-sm text-muted-foreground">
                  You've completed {healthData.activity.steps.toLocaleString()} steps and {healthData.activity.activeMinutes} active minutes, which is helping maintain your cardiovascular health and metabolism.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveHealthDashboard;
