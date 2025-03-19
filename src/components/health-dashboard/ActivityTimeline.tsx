
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthMetric, TimeRange } from '@/services/healthDataService';
import { ActivitySquare, Flame, Route } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityTimelineProps {
  stepsData: HealthMetric[];
  caloriesData: HealthMetric[];
  distanceData: HealthMetric[];
  timeRange: TimeRange;
  isLoading: boolean;
  showDetails?: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  stepsData,
  caloriesData,
  distanceData,
  timeRange,
  isLoading,
  showDetails = false
}) => {
  const [activeChart, setActiveChart] = React.useState<'steps' | 'calories' | 'distance'>('steps');
  
  // Format data for charts
  const formatChartData = () => {
    // Create a map of dates to combined metrics
    const dataMap = new Map<string, any>();
    
    // Process steps data
    stepsData.forEach(metric => {
      const date = new Date(metric.timestamp).toLocaleDateString();
      if (!dataMap.has(date)) {
        dataMap.set(date, { date });
      }
      dataMap.get(date).steps = metric.value;
    });
    
    // Process calories data
    caloriesData.forEach(metric => {
      const date = new Date(metric.timestamp).toLocaleDateString();
      if (!dataMap.has(date)) {
        dataMap.set(date, { date });
      }
      dataMap.get(date).calories = metric.value;
    });
    
    // Process distance data
    distanceData.forEach(metric => {
      const date = new Date(metric.timestamp).toLocaleDateString();
      if (!dataMap.has(date)) {
        dataMap.set(date, { date });
      }
      dataMap.get(date).distance = metric.value;
    });
    
    // Convert map to array and sort by date
    const chartData = Array.from(dataMap.values());
    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return chartData;
  };
  
  const chartData = formatChartData();
  
  // Calculate averages
  const calculateAverage = (data: HealthMetric[]) => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, metric) => acc + Number(metric.value), 0);
    return Math.round(sum / data.length);
  };
  
  const averageSteps = calculateAverage(stepsData);
  const averageCalories = calculateAverage(caloriesData);
  const averageDistance = calculateAverage(distanceData);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ActivitySquare className="h-5 w-5 mr-2 text-blue-500" />
          Activity Timeline
        </CardTitle>
        <CardDescription>
          Your activity metrics over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChart} onValueChange={(value) => setActiveChart(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="steps" className="flex items-center">
              <ActivitySquare className="h-4 w-4 mr-1 text-blue-500" />
              Steps
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center">
              <Flame className="h-4 w-4 mr-1 text-orange-500" />
              Calories
            </TabsTrigger>
            <TabsTrigger value="distance" className="flex items-center">
              <Route className="h-4 w-4 mr-1 text-green-500" />
              Distance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps" className="mt-0">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12} 
                    tickFormatter={(value) => {
                      // Format date based on time range
                      const date = new Date(value);
                      if (timeRange === 'day') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      if (timeRange === 'week') return date.toLocaleDateString([], { weekday: 'short' });
                      if (timeRange === 'month') return date.toLocaleDateString([], { day: 'numeric' });
                      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [`${value} steps`, 'Steps']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar 
                    dataKey="steps" 
                    fill="#3b82f6" 
                    name="Steps"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Average: <span className="font-medium">{averageSteps} steps</span></p>
            </div>
          </TabsContent>
          
          <TabsContent value="calories" className="mt-0">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      if (timeRange === 'day') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      if (timeRange === 'week') return date.toLocaleDateString([], { weekday: 'short' });
                      if (timeRange === 'month') return date.toLocaleDateString([], { day: 'numeric' });
                      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [`${value} kcal`, 'Calories']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar 
                    dataKey="calories" 
                    fill="#f97316" 
                    name="Calories"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Average: <span className="font-medium">{averageCalories} kcal</span></p>
            </div>
          </TabsContent>
          
          <TabsContent value="distance" className="mt-0">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      if (timeRange === 'day') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      if (timeRange === 'week') return date.toLocaleDateString([], { weekday: 'short' });
                      if (timeRange === 'month') return date.toLocaleDateString([], { day: 'numeric' });
                      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [`${value} km`, 'Distance']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="distance" 
                    stroke="#22c55e" 
                    name="Distance" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Average: <span className="font-medium">{averageDistance.toFixed(2)} km</span></p>
            </div>
          </TabsContent>
        </Tabs>
        
        {showDetails && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-400">Daily Steps</p>
                    <h4 className="text-lg font-bold text-blue-900 dark:text-blue-300">{averageSteps}</h4>
                  </div>
                  <ActivitySquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-orange-800 dark:text-orange-400">Calories Burned</p>
                    <h4 className="text-lg font-bold text-orange-900 dark:text-orange-300">{averageCalories}</h4>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-800 dark:text-green-400">Distance</p>
                    <h4 className="text-lg font-bold text-green-900 dark:text-green-300">{averageDistance.toFixed(2)} km</h4>
                  </div>
                  <Route className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
