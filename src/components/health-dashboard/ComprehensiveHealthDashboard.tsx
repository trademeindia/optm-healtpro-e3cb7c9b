
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplet, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Bed
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { HealthData } from '@/hooks/useHealthData';

interface ComprehensiveHealthDashboardProps {
  healthData: HealthData | null;
  isLoading: boolean;
  lastSynced: Date | null;
  onSyncClick: () => Promise<boolean>;
}

const VitalSignCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  change, 
  icon 
}: { 
  title: string; 
  value: number | string; 
  unit: string; 
  trend?: 'up' | 'down' | 'stable'; 
  change?: number;
  icon: React.ReactNode;
}) => {
  const getTrendIcon = () => {
    if (!trend) return <Minus className="h-3 w-3" />;
    
    if (trend === 'up') return <TrendingUp className="h-3 w-3" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };
  
  const getTrendColor = () => {
    if (!trend || trend === 'stable') return "text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800";
    
    // For heart rate and blood pressure, reverse the colors (lower is typically better)
    if (title === 'Heart Rate' || title === 'Blood Pressure') {
      return trend === 'up'
        ? "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
        : "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    }
    
    // For oxygen saturation, higher is better
    if (title === 'Oxygen Saturation') {
      return trend === 'up'
        ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
        : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    }
    
    // For body temperature, stable is better
    if (title === 'Body Temperature') {
      return trend === 'stable'
        ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
        : "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
    }
    
    // Default coloring
    return trend === 'up'
      ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
  };
  
  return (
    <motion.div
      className="p-4 border rounded-lg bg-card shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      
      {typeof change !== 'undefined' && (
        <div className="mt-2 flex items-center">
          <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-muted-foreground ml-1.5">
            vs. last week
          </span>
        </div>
      )}
    </motion.div>
  );
};

const ComprehensiveHealthDashboard: React.FC<ComprehensiveHealthDashboardProps> = ({
  healthData,
  isLoading,
  lastSynced,
  onSyncClick
}) => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSyncClick = async () => {
    setIsSyncing(true);
    await onSyncClick();
    setIsSyncing(false);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="mt-4 text-muted-foreground">Loading your health data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!healthData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No health data available</p>
            <Button onClick={handleSyncClick} disabled={isSyncing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {isSyncing ? 'Syncing...' : 'Sync Health Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get trend data based on selected time range
  const trendData = healthData.trends[timeRange];
  
  // Format blood pressure for display
  const bpDisplay = `${healthData.vitalSigns.bloodPressure.systolic}/${healthData.vitalSigns.bloodPressure.diastolic}`;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Health Dashboard</CardTitle>
        <div className="flex items-center gap-2">
          {lastSynced && (
            <span className="text-xs text-muted-foreground">
              Last updated {formatDistanceToNow(lastSynced, { addSuffix: true })}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleSyncClick} disabled={isSyncing}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vital Signs Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Vital Signs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <VitalSignCard
              title="Heart Rate"
              value={healthData.vitalSigns.heartRate.value}
              unit={healthData.vitalSigns.heartRate.unit}
              trend={healthData.vitalSigns.heartRate.trend}
              change={healthData.vitalSigns.heartRate.change}
              icon={<Heart className="h-4 w-4" />}
            />
            <VitalSignCard
              title="Blood Pressure"
              value={bpDisplay}
              unit={healthData.vitalSigns.bloodPressure.unit}
              trend={healthData.vitalSigns.bloodPressure.trend}
              change={healthData.vitalSigns.bloodPressure.change}
              icon={<Activity className="h-4 w-4" />}
            />
            <VitalSignCard
              title="Body Temperature"
              value={healthData.vitalSigns.bodyTemperature.value.toFixed(1)}
              unit={healthData.vitalSigns.bodyTemperature.unit}
              trend={healthData.vitalSigns.bodyTemperature.trend}
              change={healthData.vitalSigns.bodyTemperature.change}
              icon={<Thermometer className="h-4 w-4" />}
            />
            <VitalSignCard
              title="Oxygen Saturation"
              value={healthData.vitalSigns.oxygenSaturation.value}
              unit={healthData.vitalSigns.oxygenSaturation.unit}
              trend={healthData.vitalSigns.oxygenSaturation.trend}
              change={healthData.vitalSigns.oxygenSaturation.change}
              icon={<Droplet className="h-4 w-4" />}
            />
          </div>
        </div>
        
        {/* Daily Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Daily Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center border rounded-lg p-4">
                  <span className="text-sm text-muted-foreground">Steps</span>
                  <span className="text-2xl font-bold">{healthData.activity.steps.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-4">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="text-2xl font-bold">{healthData.activity.distance} <span className="text-sm font-normal">km</span></span>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-4">
                  <span className="text-sm text-muted-foreground">Calories</span>
                  <span className="text-2xl font-bold">{healthData.activity.caloriesBurned} <span className="text-sm font-normal">kcal</span></span>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-4">
                  <span className="text-sm text-muted-foreground">Active Time</span>
                  <span className="text-2xl font-bold">{healthData.activity.activeMinutes} <span className="text-sm font-normal">min</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sleep Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{healthData.sleep.duration}</span>
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                  <span className="text-sm">Sleep quality: <span className="font-medium capitalize">{healthData.sleep.quality}</span></span>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Bed className="h-5 w-5" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Deep sleep</span>
                  <span className="text-xs font-medium">{healthData.sleep.deepSleep} hrs</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(healthData.sleep.deepSleep / healthData.sleep.duration) * 100}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs">REM sleep</span>
                  <span className="text-xs font-medium">{healthData.sleep.remSleep} hrs</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(healthData.sleep.remSleep / healthData.sleep.duration) * 100}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs">Light sleep</span>
                  <span className="text-xs font-medium">{healthData.sleep.lightSleep} hrs</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${(healthData.sleep.lightSleep / healthData.sleep.duration) * 100}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Trend Charts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Health Trends</h3>
            <div className="flex items-center space-x-1 rounded-md border p-1">
              <Button 
                variant={timeRange === 'weekly' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setTimeRange('weekly')}
                className="text-xs px-2.5"
              >
                Weekly
              </Button>
              <Button 
                variant={timeRange === 'monthly' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setTimeRange('monthly')}
                className="text-xs px-2.5"
              >
                Monthly
              </Button>
              <Button 
                variant={timeRange === 'yearly' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setTimeRange('yearly')}
                className="text-xs px-2.5"
              >
                Yearly
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="vital-signs">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vital-signs">Vital Signs</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vital-signs" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Heart Rate & Blood Pressure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey={timeRange === 'weekly' ? 'day' : timeRange === 'monthly' ? 'date' : 'month'} 
                          fontSize={12}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#ef4444" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" domain={[60, 180]} fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="heartRate"
                          name="Heart Rate (bpm)"
                          stroke="#ef4444"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="bloodPressureSystolic"
                          name="Systolic (mmHg)"
                          stroke="#3b82f6"
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="bloodPressureDiastolic"
                          name="Diastolic (mmHg)"
                          stroke="#93c5fd"
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Temperature & Oxygen Saturation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey={timeRange === 'weekly' ? 'day' : timeRange === 'monthly' ? 'date' : 'month'} 
                          fontSize={12}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#f59e0b" domain={[97, 100]} fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[96, 100]} fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="temperature"
                          name="Temperature (°F)"
                          stroke="#f59e0b"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="oxygenSaturation"
                          name="Oxygen Saturation (%)"
                          stroke="#10b981"
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Daily Steps & Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={trendData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey={timeRange === 'weekly' ? 'day' : timeRange === 'monthly' ? 'date' : 'month'} 
                          fontSize={12}
                        />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="steps" name="Steps" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sleep">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Sleep Duration & Quality</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground">
                    Detailed sleep tracking data will be available soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* AI Health Insights */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <span className="mr-2">🧠</span> AI Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium flex items-center">
                <Heart className="h-4 w-4 mr-2 text-rose-500" />
                Cardiovascular Health
              </h4>
              <p className="text-sm mt-2">
                Your heart rate remains within the normal range with minimal fluctuations, indicating good cardiovascular stability. 
                Your blood pressure shows a slight downward trend, which is generally positive. Keep up with regular exercise and maintain 
                your hydration levels to continue supporting your heart health.
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-medium flex items-center">
                <Droplet className="h-4 w-4 mr-2 text-blue-500" />
                Respiratory Health
              </h4>
              <p className="text-sm mt-2">
                Your oxygen saturation levels are excellent at 98%, which indicates proper lung function and oxygen circulation. 
                This suggests your respiratory system is working efficiently with no signs of respiratory distress. Continue with 
                any breathing exercises or activities that support your respiratory health.
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-medium flex items-center">
                <Thermometer className="h-4 w-4 mr-2 text-amber-500" />
                General Health
              </h4>
              <p className="text-sm mt-2">
                Your body temperature has remained stable at 98.6°F, which is within the normal range. 
                This suggests your immune system is functioning well with no indications of inflammation or infection. 
                Your consistent sleep pattern also contributes positively to your overall health maintenance.
              </p>
            </div>
            
            <div className="rounded-lg border p-4 bg-primary/5">
              <h4 className="font-medium">Recommendations</h4>
              <ul className="text-sm mt-2 space-y-2">
                <li className="flex items-start">
                  <span className="rounded-full bg-green-100 text-green-600 p-1 mr-2 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  Continue your regular physical activity to maintain cardiovascular health
                </li>
                <li className="flex items-start">
                  <span className="rounded-full bg-green-100 text-green-600 p-1 mr-2 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  Monitor your blood pressure readings to track the positive trend
                </li>
                <li className="flex items-start">
                  <span className="rounded-full bg-green-100 text-green-600 p-1 mr-2 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  Maintain your sleep schedule for optimal recovery and health
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveHealthDashboard;
