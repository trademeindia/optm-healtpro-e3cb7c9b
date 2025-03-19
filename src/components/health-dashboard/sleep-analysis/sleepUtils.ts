
import { HealthMetric } from '@/services/health';

// Sleep stage names mapping (Google Fit sleep stages)
export const sleepStageNames: Record<number, string> = {
  1: 'Awake', // (1) - Awake (during sleep cycles)
  2: 'Sleep', // (2) - Sleep (undifferentiated)
  3: 'Out of Bed', // (3) - Out of bed
  4: 'Light Sleep', // (4) - Light sleep
  5: 'Deep Sleep', // (5) - Deep sleep
  6: 'REM Sleep', // (6) - REM sleep
};

// Mapping of sleep stages to colors
export const sleepStageColors: Record<number, string> = {
  1: '#f97316', // Orange for Awake
  2: '#3b82f6', // Blue for Sleep (general)
  3: '#ef4444', // Red for Out of Bed
  4: '#a3e635', // Light green for Light Sleep
  5: '#14b8a6', // Teal for Deep Sleep
  6: '#8b5cf6', // Purple for REM Sleep
};

interface DailySleep {
  date: string;
  sleepMinutes: number;
}

export interface SleepProcessedData {
  dailySleep: DailySleep[];
  sleepStages: any[];
}

/**
 * Process sleep data into a more usable format
 */
export const processSleepData = (sleepData: HealthMetric[]): SleepProcessedData => {
  if (!sleepData || sleepData.length === 0) return { dailySleep: [], sleepStages: [] };
  
  // Group by date and calculate total sleep time per day
  const dailySleepMap = new Map<string, { date: string, sleepMinutes: number }>();
  
  // Group sleep stages
  const sleepStagesMap = new Map<string, Record<number, number>>();
  
  sleepData.forEach(metric => {
    const date = new Date(metric.timestamp).toLocaleDateString();
    // Properly convert value to number to avoid type errors
    // Cast to unknown first if the value might be a string
    const durationMinutes = typeof metric.value === 'string' 
      ? Number(metric.value as unknown as string) 
      : Number(metric.value);
    
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

/**
 * Calculate average sleep time
 */
export const calculateAverageSleep = (dailySleep: { sleepMinutes: number }[]): number => {
  if (!dailySleep || dailySleep.length === 0) return 0;
  
  const totalMinutes = dailySleep.reduce((sum, day) => sum + day.sleepMinutes, 0);
  return Math.round(totalMinutes / dailySleep.length);
};

/**
 * Calculate sleep quality score (70% is baseline, adjust based on deep and REM sleep)
 */
export const calculateSleepQuality = (sleepStages: any[]): number => {
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

/**
 * Get sleep quality description
 */
export const getSleepQualityText = (sleepQualityScore: number) => {
  if (sleepQualityScore >= 90) return { text: 'Excellent', color: 'text-green-500' };
  if (sleepQualityScore >= 80) return { text: 'Very Good', color: 'text-green-500' };
  if (sleepQualityScore >= 70) return { text: 'Good', color: 'text-blue-500' };
  if (sleepQualityScore >= 60) return { text: 'Fair', color: 'text-yellow-500' };
  if (sleepQualityScore >= 50) return { text: 'Poor', color: 'text-orange-500' };
  return { text: 'Very Poor', color: 'text-red-500' };
};
