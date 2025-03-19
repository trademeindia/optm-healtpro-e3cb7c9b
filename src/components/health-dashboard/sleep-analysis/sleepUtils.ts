
import { HealthMetric } from '@/services/health';

export interface SleepData {
  date: string;
  duration: number;
  quality: number;
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awake: number;
}

export interface ProcessedSleepData {
  sleepData: SleepData[];
  averageSleepHours: number;
  averageSleepMinutesRemainder: number;
  sleepQualityScore: number;
  qualityText: { text: string; color: string };
}

/**
 * Calculate the sleep quality score (0-100)
 */
export const calculateSleepQuality = (
  deepSleepPercentage: number,
  remSleepPercentage: number,
  awakeTimePercentage: number
): number => {
  // Weight factors for sleep quality calculation
  const deepSleepWeight = 0.5;
  const remSleepWeight = 0.3;
  const awakeTimeWeight = 0.2;
  
  // Calculate quality score (0-100)
  // Deep sleep and REM sleep contribute positively, awake time contributes negatively
  let score = 
    (deepSleepPercentage * deepSleepWeight * 100) + 
    (remSleepPercentage * remSleepWeight * 100) - 
    (awakeTimePercentage * awakeTimeWeight * 100);
  
  // Ensure score is within 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  return Math.round(score);
};

/**
 * Get a text description of sleep quality based on score
 */
export const getSleepQualityText = (score: number): { text: string; color: string } => {
  if (score >= 85) return { text: 'Excellent', color: 'text-green-500' };
  if (score >= 70) return { text: 'Good', color: 'text-green-400' };
  if (score >= 50) return { text: 'Fair', color: 'text-yellow-500' };
  if (score >= 30) return { text: 'Poor', color: 'text-orange-500' };
  return { text: 'Very Poor', color: 'text-red-500' };
};

/**
 * Process sleep metrics into display-friendly format
 */
export const processSleepData = (sleepMetrics: HealthMetric[]): ProcessedSleepData => {
  const defaultResponse = {
    sleepData: [],
    averageSleepHours: 0,
    averageSleepMinutesRemainder: 0,
    sleepQualityScore: 0,
    qualityText: { text: 'No Data', color: 'text-gray-500' }
  };
  
  if (!sleepMetrics || sleepMetrics.length === 0) {
    return defaultResponse;
  }
  
  const sleepData: SleepData[] = sleepMetrics
    .filter(metric => metric.metadata?.stages) // Ensure we have sleep stage data
    .map(metric => {
      const sleepDateStr = new Date(metric.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      const sleepStages = metric.metadata?.stages || {};
      const totalSleepMinutes = Number(metric.value);
      
      // Convert to hours for display
      const durationHours = totalSleepMinutes / 60;
      
      // Calculate percentages for each sleep stage
      const deepSleepMinutes = Number(sleepStages.deep || 0);
      const lightSleepMinutes = Number(sleepStages.light || 0);
      const remSleepMinutes = Number(sleepStages.rem || 0);
      const awakeMinutes = Number(sleepStages.awake || 0);
      
      // Calculate sleep quality score
      const deepSleepPercentage = deepSleepMinutes / totalSleepMinutes;
      const remSleepPercentage = remSleepMinutes / totalSleepMinutes;
      const awakeTimePercentage = awakeMinutes / totalSleepMinutes;
      
      const qualityScore = calculateSleepQuality(
        deepSleepPercentage,
        remSleepPercentage,
        awakeTimePercentage
      );
      
      return {
        date: sleepDateStr,
        duration: durationHours,
        quality: qualityScore,
        deepSleep: deepSleepMinutes,
        lightSleep: lightSleepMinutes,
        remSleep: remSleepMinutes,
        awake: awakeMinutes
      };
    });
  
  // Calculate overall metrics
  let totalSleepHours = 0;
  let totalQualityScore = 0;
  
  sleepData.forEach(data => {
    totalSleepHours += data.duration;
    totalQualityScore += data.quality;
  });
  
  const averageSleepHours = Math.floor(totalSleepHours / sleepData.length);
  const averageSleepMinutesRemainder = Math.round(
    (totalSleepHours / sleepData.length - averageSleepHours) * 60
  );
  const sleepQualityScore = Math.round(totalQualityScore / sleepData.length);
  const qualityText = getSleepQualityText(sleepQualityScore);
  
  return {
    sleepData,
    averageSleepHours,
    averageSleepMinutesRemainder,
    sleepQualityScore,
    qualityText
  };
};
