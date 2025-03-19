
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthMetric, TimeRange } from '@/services/healthDataService';
import { Moon, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface SleepAnalysisProps {
  sleepData: HealthMetric[];
  timeRange: TimeRange;
  isLoading: boolean;
}

// Sleep stage names mapping (Google Fit sleep stages)
const sleepStageNames: Record<number, string> = {
  1: 'Awake', // (1) - Awake (during sleep cycles)
  2: 'Sleep', // (2) - Sleep (undifferentiated)
  3: 'Out of Bed', // (3) - Out of bed
  4: 'Light Sleep', // (4) - Light sleep
  5: 'Deep Sleep', // (5) - Deep sleep
  6: 'REM Sleep', // (6) - REM sleep
};

// Mapping of sleep stages to colors
const sleepStageColors: Record<number, string> = {
  1: '#f97316', // Orange for Awake
  2: '#3b82f6', // Blue for Sleep (general)
  3: '#ef4444', // Red for Out of Bed
  4: '#a3e635', // Light green for Light Sleep
  5: '#14b8a6', // Teal for Deep Sleep
  6: '#8b5cf6', // Purple for REM Sleep
};

const SleepAnalysis: React.FC<SleepAnalysisProps> = ({
  sleepData,
  timeRange,
  isLoading
}) => {
  // Process sleep data into a more usable format
  const processSleepData = () => {
    if (!sleepData || sleepData.length === 0) return { dailySleep: [], sleepStages: [] };
    
    // Group by date and calculate total sleep time per day
    const dailySleepMap = new Map<string, { date: string, sleepMinutes: number }>();
    
    // Group sleep stages
    const sleepStagesMap = new Map<string, Record<number, number>>();
    
    sleepData.forEach(metric => {
      const date = new Date(metric.timestamp).toLocaleDateString();
      // Convert value to number to ensure it's a numeric type
      const durationMinutes = Number(metric.value);
      const sleepStage = metric.metadata?.sleepStage as number;
      
      // Add to daily sleep total
      if (!dailySleepMap.has(date)) {
        dailySleepMap.set(date, { date, sleepMinutes: 0 });
      }
      dailySleepMap.get(date)!.sleepMinutes += durationMinutes;
      
      // Add to sleep stages
      if (!sleepStagesMap.has(date)) {
        sleepStagesMap.set(date, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
      }
      
      if (sleepStage) {
        sleepStagesMap.get(date)![sleepStage] += durationMinutes;
      } else {
        // Default to general sleep if no stage is specified
        sleepStagesMap.get(date)![2] += durationMinutes;
      }
    });
    
    // Convert maps to arrays and sort by date
    const dailySleep = Array.from(dailySleepMap.values());
    dailySleep.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Format sleep stages data for stacked bar chart
    const sleepStages = Array.from(sleepStagesMap.entries()).map(([date, stages]) => ({
      date,
      ...stages
    }));
    sleepStages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return { dailySleep, sleepStages };
  };
  
  const { dailySleep, sleepStages } = processSleepData();
  
  // Calculate average sleep time
  const calculateAverageSleep = () => {
    if (!dailySleep || dailySleep.length === 0) return 0;
    
    const totalMinutes = dailySleep.reduce((sum, day) => sum + day.sleepMinutes, 0);
    return Math.round(totalMinutes / dailySleep.length);
  };
  
  const averageSleepMinutes = calculateAverageSleep();
  const averageSleepHours = Math.floor(averageSleepMinutes / 60);
  const averageSleepMinutesRemainder = averageSleepMinutes % 60;
  
  // Calculate sleep quality score (70% is baseline, adjust based on deep and REM sleep)
  const calculateSleepQuality = () => {
    if (!sleepStages || sleepStages.length === 0) return 70; // Default
    
    // Average over the most recent 7 days or all available data
    const recentDays = sleepStages.slice(-7);
    
    let totalDeepSleep = 0;
    let totalRemSleep = 0;
    let totalSleepTime = 0;
    
    recentDays.forEach(day => {
      const deepSleep = day[5] || 0; // Deep sleep
      const remSleep = day[6] || 0;   // REM sleep
      const totalDay = Object.values(day)
        .filter((_, index) => index > 0) // Skip the date
        .reduce((sum, mins) => sum + (mins as number), 0);
      
      totalDeepSleep += deepSleep;
      totalRemSleep += remSleep;
      totalSleepTime += totalDay;
    });
    
    if (totalSleepTime === 0) return 70;
    
    // Ideal: 20-25% deep sleep, 20-25% REM sleep
    const deepSleepPercent = (totalDeepSleep / totalSleepTime) * 100;
    const remSleepPercent = (totalRemSleep / totalSleepTime) * 100;
    
    // Base score is 70
    let qualityScore = 70;
    
    // Adjust based on deep sleep (optimal around 20-25%)
    if (deepSleepPercent > 15) qualityScore += 15;
    else if (deepSleepPercent > 10) qualityScore += 10;
    else if (deepSleepPercent > 5) qualityScore += 5;
    
    // Adjust based on REM sleep (optimal around 20-25%)
    if (remSleepPercent > 15) qualityScore += 15;
    else if (remSleepPercent > 10) qualityScore += 10;
    else if (remSleepPercent > 5) qualityScore += 5;
    
    // Cap at 100
    return Math.min(qualityScore, 100);
  };
  
  const sleepQualityScore = calculateSleepQuality();
  
  // Get sleep quality description
  const getSleepQualityText = () => {
    if (sleepQualityScore >= 90) return { text: 'Excellent', color: 'text-green-500' };
    if (sleepQualityScore >= 80) return { text: 'Very Good', color: 'text-green-500' };
    if (sleepQualityScore >= 70) return { text: 'Good', color: 'text-blue-500' };
    if (sleepQualityScore >= 60) return { text: 'Fair', color: 'text-yellow-500' };
    if (sleepQualityScore >= 50) return { text: 'Poor', color: 'text-orange-500' };
    return { text: 'Very Poor', color: 'text-red-500' };
  };
  
  const qualityText = getSleepQualityText();
  
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
          <Moon className="h-5 w-5 mr-2 text-blue-500" />
          Sleep Analysis
        </CardTitle>
        <CardDescription>
          Your sleep patterns and quality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg. Sleep Duration</p>
            <p className="text-2xl font-bold">
              {averageSleepHours}h {averageSleepMinutesRemainder}m
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Sleep Quality</p>
            <p className={`text-2xl font-bold ${qualityText.color}`}>
              {qualityText.text}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Quality Score</p>
            <p className="text-2xl font-bold">
              {sleepQualityScore}/100
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Sleep Duration</h4>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySleep}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString([], { weekday: 'short' });
                  }}
                />
                <YAxis 
                  fontSize={12}
                  tickFormatter={(value) => `${Math.floor(value / 60)}h`}
                />
                <Tooltip 
                  formatter={(value: any) => {
                    const hours = Math.floor(value / 60);
                    const minutes = value % 60;
                    return [`${hours}h ${minutes}m`, 'Sleep Duration'];
                  }}
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                />
                <Bar 
                  dataKey="sleepMinutes" 
                  fill="#3b82f6" 
                  name="Sleep Duration"
                />
                <ReferenceLine 
                  y={480} // 8 hours
                  stroke="#22c55e" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: 'Recommended (8h)', 
                    position: 'insideBottomRight', 
                    fontSize: 10 
                  }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {sleepStages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Sleep Stages</h4>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepStages} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString([], { weekday: 'short' });
                    }}
                  />
                  <YAxis 
                    fontSize={12}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      const hours = Math.floor(value / 60);
                      const minutes = value % 60;
                      const stageName = sleepStageNames[parseInt(name)] || name;
                      return [`${hours}h ${minutes}m`, stageName];
                    }}
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  />
                  <Legend 
                    formatter={(value) => {
                      const stageNumber = parseInt(value);
                      return sleepStageNames[stageNumber] || value;
                    }}
                  />
                  {Object.keys(sleepStageNames).map((stageNumber) => (
                    <Bar 
                      key={stageNumber}
                      dataKey={stageNumber}
                      stackId="a"
                      fill={sleepStageColors[parseInt(stageNumber)]}
                      name={stageNumber}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {dailySleep.length > 0 && (
          <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-400">Sleep Insights</p>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {averageSleepMinutes < 420 ? (
                      "You're averaging less than 7 hours of sleep. Aim for 7-9 hours for optimal health."
                    ) : averageSleepMinutes > 540 ? (
                      "You're averaging more than 9 hours of sleep. While this might be what your body needs, consider consulting your doctor if you feel excessively tired."
                    ) : (
                      "You're averaging between 7-9 hours of sleep, which is the recommended amount for adults."
                    )}
                    {sleepQualityScore < 70 ? (
                      " Your sleep quality could be improved. Try maintaining a consistent sleep schedule."
                    ) : (
                      " Your sleep quality is good. Keep maintaining your healthy sleep habits."
                    )}
                  </p>
                </div>
                <Moon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        )}
        
        {dailySleep.length === 0 && (
          <div className="text-center py-8">
            <Moon className="h-12 w-12 text-blue-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground">No Sleep Data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Wear your device during sleep to track your sleep patterns
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SleepAnalysis;
