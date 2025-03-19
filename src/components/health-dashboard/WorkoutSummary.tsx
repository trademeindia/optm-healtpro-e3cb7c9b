
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthMetric, TimeRange } from '@/services/healthDataService';
import { Dumbbell, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkoutSummaryProps {
  workoutData: HealthMetric[];
  timeRange: TimeRange;
  isLoading: boolean;
}

// Google Fit activity type mapping
// https://developers.google.com/android/reference/com/google/android/gms/fitness/data/FitnessActivities
const activityTypes: Record<number, string> = {
  0: 'Unknown',
  1: 'Walking',
  2: 'Running',
  3: 'Biking',
  4: 'Biking',
  7: 'Walking',
  8: 'Running',
  9: 'Walking',
  10: 'On a treadmill',
  11: 'Biking',
  17: 'Aerobics',
  18: 'Strength training',
  19: 'Circuit training',
  20: 'Core exercises',
  21: 'Elliptical',
  22: 'Stair climbing',
  23: 'High-intensity training',
  24: 'Jump rope',
  25: 'Dancing',
  26: 'Pilates',
  27: 'Yoga',
  31: 'Swimming',
  37: 'Basketball',
  38: 'Badminton',
  39: 'Cricket',
  40: 'Frisbee',
  41: 'Soccer',
  42: 'American Football',
  43: 'Rugby',
  44: 'Tennis',
  45: 'Volleyball',
  46: 'Golf',
  47: 'Baseball',
  48: 'Skiing',
  49: 'Snowboarding',
  50: 'Rowing',
  51: 'Zumba',
  52: 'CrossFit',
  53: 'Handball',
  54: 'Hiking',
  55: 'Skating',
  56: 'Racquetball',
  57: 'Squash',
  58: 'Martial arts',
  59: 'Weight training',
  60: 'Gymnastics',
  61: 'Boxing',
  62: 'Wrestling',
  63: 'Tai Chi',
  64: 'Rock climbing',
  65: 'Windsurfing',
  66: 'Kitesurfing',
  67: 'Paragliding',
  68: 'Horse riding',
  69: 'Polo',
  70: 'Ice Skating',
  71: 'Roller Skating',
  72: 'Wheelchair',
  73: 'Climbing',
  74: 'Paddleboarding',
  75: 'Hunting',
  76: 'Fishing',
  77: 'Surfing',
  78: 'Gardening',
  79: 'Jumping rope',
  80: 'Stair climbing',
  81: 'Stretching',
  82: 'Still (not moving)',
  83: 'Other workouts',
  84: 'Light sleep',
  85: 'Deep sleep',
  86: 'REM sleep',
  87: 'Sleeping',
  88: 'In vehicle',
  89: 'Move',
  90: 'Elevator',
  91: 'Escalator',
};

// Activity type to color mapping
const activityColors = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#22c55e', // Green
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#84cc16', // Lime
];

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workoutData,
  timeRange,
  isLoading
}) => {
  // Process workout data
  const processWorkoutData = () => {
    if (!workoutData || workoutData.length === 0) {
      return { 
        totalWorkouts: 0, 
        totalDuration: 0, 
        activityBreakdown: [], 
        recentWorkouts: [] 
      };
    }
    
    // Sort by timestamp (most recent first)
    const sortedData = [...workoutData].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Get recent workouts
    const recentWorkouts = sortedData.slice(0, 5).map(workout => {
      const activityType = workout.metadata?.activityType as number;
      const activityName = activityTypes[activityType] || 'Other';
      
      return {
        id: workout.id,
        date: new Date(workout.timestamp).toLocaleDateString(),
        time: new Date(workout.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: workout.value,
        activityType: activityName
      };
    });
    
    // Calculate total workouts and duration
    const totalWorkouts = sortedData.length;
    const totalDuration = sortedData.reduce((sum, workout) => sum + Number(workout.value), 0);
    
    // Calculate activity type breakdown
    const activityCounts: Record<number, { type: number, count: number, duration: number }> = {};
    
    sortedData.forEach(workout => {
      const activityType = workout.metadata?.activityType as number;
      
      if (!activityCounts[activityType]) {
        activityCounts[activityType] = { type: activityType, count: 0, duration: 0 };
      }
      
      activityCounts[activityType].count += 1;
      activityCounts[activityType].duration += Number(workout.value);
    });
    
    // Convert to array for chart
    const activityBreakdown = Object.values(activityCounts)
      .sort((a, b) => b.duration - a.duration)
      .map(activity => ({
        name: activityTypes[activity.type] || 'Other',
        value: activity.duration,
        count: activity.count
      }));
    
    return {
      totalWorkouts,
      totalDuration,
      activityBreakdown,
      recentWorkouts
    };
  };
  
  const { totalWorkouts, totalDuration, activityBreakdown, recentWorkouts } = processWorkoutData();
  
  // Format duration (minutes) to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    
    return `${mins}m`;
  };
  
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
          <Dumbbell className="h-5 w-5 mr-2 text-purple-500" />
          Workout Summary
        </CardTitle>
        <CardDescription>
          Your workout activities and statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Card className="bg-purple-50 dark:bg-purple-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-800 dark:text-purple-400">Total Workouts</p>
                  <h4 className="text-2xl font-bold text-purple-900 dark:text-purple-300">{totalWorkouts}</h4>
                </div>
                <Dumbbell className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-indigo-50 dark:bg-indigo-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-indigo-800 dark:text-indigo-400">Total Duration</p>
                  <h4 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">{formatDuration(totalDuration)}</h4>
                </div>
                <Calendar className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {activityBreakdown.length > 0 ? (
          <>
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Activity Breakdown</h4>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={1}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {activityBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={activityColors[index % activityColors.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [formatDuration(value), 'Duration']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Workouts</h4>
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <Card key={workout.id} className="bg-gray-50 dark:bg-gray-900/20">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">{workout.activityType}</h5>
                          <p className="text-xs text-muted-foreground">
                            {workout.date} at {workout.time} • {formatDuration(workout.duration)}
                          </p>
                        </div>
                        <div className="p-2 rounded-full bg-primary/10">
                          <Dumbbell className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Dumbbell className="h-12 w-12 text-purple-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground">No Workout Data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Log your workouts in Google Fit to see your activity here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutSummary;
