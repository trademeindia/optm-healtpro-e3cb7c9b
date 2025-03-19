
import { HealthMetric } from '@/services/health';

export interface SleepStage {
  stage: string;
  minutes: number;
}

export interface DailySleep {
  date: string;
  durationMinutes: number;
  sleepMinutes: number;
  qualityScore: number;
}

export interface ProcessedSleepData {
  dailySleep: DailySleep[];
  sleepStages: SleepStage[];
}

// Sleep stage names and colors for charts
export const sleepStageNames: Record<string | number, string> = {
  'deep': 'Deep Sleep',
  'light': 'Light Sleep',
  'rem': 'REM Sleep',
  'awake': 'Awake'
};

export const sleepStageColors: Record<string | number, string> = {
  'deep': '#3b82f6',  // blue
  'light': '#22c55e', // green
  'rem': '#8b5cf6',   // purple
  'awake': '#f97316'  // orange
};

/**
 * Process raw sleep data into formats needed for visualization
 */
export const processSleepData = (sleepData: HealthMetric[]): ProcessedSleepData => {
  if (!sleepData || sleepData.length === 0) {
    return {
      dailySleep: [],
      sleepStages: []
    };
  }

  // Sort data by date
  const sortedData = [...sleepData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Process daily sleep durations
  const dailySleep: DailySleep[] = sortedData.map(metric => {
    const date = new Date(metric.timestamp);
    return {
      date: date.toLocaleDateString(),
      durationMinutes: metric.value,
      sleepMinutes: metric.value, // Add this for compatibility with SleepDurationChart
      qualityScore: metric.metadata?.quality || 0
    };
  });

  // Process sleep stages if available
  const sleepStages: SleepStage[] = [];
  
  // Extract sleep stage data from metadata if available
  sortedData.forEach(metric => {
    if (metric.metadata?.stages) {
      const stages = metric.metadata.stages;
      
      Object.entries(stages).forEach(([stage, minutes]) => {
        const existingStage = sleepStages.find(s => s.stage === stage);
        
        if (existingStage) {
          existingStage.minutes += Number(minutes);
        } else {
          sleepStages.push({
            stage,
            minutes: Number(minutes)
          });
        }
      });
    }
  });

  return {
    dailySleep,
    sleepStages
  };
};

/**
 * Calculate average sleep duration in minutes
 */
export const calculateAverageSleep = (dailySleep: DailySleep[]): number => {
  if (dailySleep.length === 0) return 0;
  
  const totalMinutes = dailySleep.reduce((sum, day) => sum + day.durationMinutes, 0);
  return Math.round(totalMinutes / dailySleep.length);
};

/**
 * Calculate sleep quality score based on stage distribution
 */
export const calculateSleepQuality = (sleepStages: SleepStage[]): number => {
  if (sleepStages.length === 0) return 0;
  
  const totalMinutes = sleepStages.reduce((sum, stage) => sum + stage.minutes, 0);
  if (totalMinutes === 0) return 0;
  
  // Weight different sleep stages by their importance for quality sleep
  const deepSleepMinutes = sleepStages.find(s => s.stage === 'deep')?.minutes || 0;
  const remSleepMinutes = sleepStages.find(s => s.stage === 'rem')?.minutes || 0;
  const awakeTimes = sleepStages.find(s => s.stage === 'awake')?.minutes || 0;
  
  // Simple quality formula: deep sleep and REM are good, being awake is bad
  const qualityScore = Math.min(100, Math.max(0, 
    (deepSleepMinutes / totalMinutes) * 40 + 
    (remSleepMinutes / totalMinutes) * 30 + 
    (1 - (awakeTimes / totalMinutes)) * 30
  ));
  
  return Math.round(qualityScore);
};

/**
 * Get descriptive text for sleep quality score
 */
export const getSleepQualityText = (qualityScore: number): { text: string; color: string } => {
  if (qualityScore >= 85) return { text: 'Excellent', color: 'text-green-500' };
  if (qualityScore >= 70) return { text: 'Good', color: 'text-blue-500' };
  if (qualityScore >= 50) return { text: 'Fair', color: 'text-yellow-500' };
  if (qualityScore >= 30) return { text: 'Poor', color: 'text-orange-500' };
  return { text: 'Very Poor', color: 'text-red-500' };
};
