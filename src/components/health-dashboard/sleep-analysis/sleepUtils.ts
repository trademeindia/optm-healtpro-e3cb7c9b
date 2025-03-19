
import { HealthMetric } from '@/services/health/types';

interface SleepStage {
  date: string;
  deep: number;
  light: number;
  rem: number;
  awake: number;
}

interface DailySleep {
  date: string;
  value: number;
  unit: string;
}

interface ProcessedSleepData {
  dailySleep: DailySleep[];
  sleepStages: SleepStage[];
}

export const processSleepData = (sleepData: HealthMetric[]): ProcessedSleepData => {
  const dailySleep: DailySleep[] = [];
  const sleepStages: SleepStage[] = [];
  
  // Group sleep data by date
  const groupedByDate = sleepData.reduce((acc, metric) => {
    const date = new Date(metric.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(metric);
    return acc;
  }, {} as Record<string, HealthMetric[]>);
  
  // Process each date's sleep data
  Object.entries(groupedByDate).forEach(([date, metrics]) => {
    // Calculate total sleep duration
    const totalSleep = metrics.reduce((sum, metric) => {
      return sum + (metric.value || 0);
    }, 0);
    
    dailySleep.push({
      date,
      value: totalSleep,
      unit: metrics[0]?.unit || 'min'
    });
    
    // Extract sleep stages from metadata if available
    const stageData = metrics.find(m => m.metadata?.sleepStages);
    if (stageData?.metadata?.sleepStages) {
      const stages = stageData.metadata.sleepStages as Record<string, number>;
      sleepStages.push({
        date,
        deep: stages.deep || 0,
        light: stages.light || 0,
        rem: stages.rem || 0,
        awake: stages.awake || 0
      });
    }
  });
  
  // Sort by date ascending
  dailySleep.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  sleepStages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return { dailySleep, sleepStages };
};

export const calculateAverageSleep = (dailySleep: DailySleep[]): number => {
  if (dailySleep.length === 0) return 0;
  
  const totalMinutes = dailySleep.reduce((sum, day) => {
    return sum + (day.value || 0);
  }, 0);
  
  return Math.round(totalMinutes / dailySleep.length);
};

export const calculateSleepQuality = (sleepStages: SleepStage[]): number => {
  if (sleepStages.length === 0) return 0;
  
  let totalScore = 0;
  
  for (const stage of sleepStages) {
    const totalMinutes = stage.deep + stage.light + stage.rem + stage.awake;
    if (totalMinutes === 0) continue;
    
    // Calculate quality score based on proportions of sleep stages
    // Deep and REM sleep are weighted more heavily as they are most restorative
    const deepProportion = stage.deep / totalMinutes;
    const remProportion = stage.rem / totalMinutes;
    const lightProportion = stage.light / totalMinutes;
    const awakeProportion = stage.awake / totalMinutes;
    
    // Score formula: weight deep and REM sleep more heavily
    const score = (deepProportion * 40) + (remProportion * 30) + 
                  (lightProportion * 20) - (awakeProportion * 30);
    
    // Normalize to 0-100 scale
    const normalizedScore = Math.max(0, Math.min(100, score * 100));
    
    totalScore += normalizedScore;
  }
  
  return Math.round(totalScore / sleepStages.length);
};

export const getSleepQualityText = (qualityScore: number): string => {
  if (qualityScore >= 80) return 'Excellent';
  if (qualityScore >= 60) return 'Good';
  if (qualityScore >= 40) return 'Fair';
  if (qualityScore >= 20) return 'Poor';
  return 'Very Poor';
};
