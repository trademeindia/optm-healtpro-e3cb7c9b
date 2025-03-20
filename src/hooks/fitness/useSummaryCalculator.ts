
import { useState, useEffect } from 'react';
import { FitnessData } from './types';

export const useSummaryCalculator = (fitnessData: FitnessData): FitnessData => {
  const [processedData, setProcessedData] = useState<FitnessData>(fitnessData);

  // Calculate summary stats when data changes
  useEffect(() => {
    // Calculate steps summary
    const stepsTotal = fitnessData.steps.data.reduce((sum, item) => sum + item.value, 0);
    const stepsAverage = stepsTotal / fitnessData.steps.data.length || 0;
    
    // Calculate heart rate summary
    const heartRates = fitnessData.heartRate.data.map(item => item.value);
    const heartRateAverage = heartRates.reduce((sum, val) => sum + val, 0) / heartRates.length || 0;
    const heartRateMin = Math.min(...heartRates);
    const heartRateMax = Math.max(...heartRates);
    
    // Calculate calories summary
    const caloriesTotal = fitnessData.calories.data.reduce((sum, item) => sum + item.value, 0);
    const caloriesAverage = caloriesTotal / fitnessData.calories.data.length || 0;
    
    setProcessedData({
      ...fitnessData,
      steps: {
        ...fitnessData.steps,
        summary: { total: stepsTotal, average: stepsAverage }
      },
      heartRate: {
        ...fitnessData.heartRate,
        summary: { average: heartRateAverage, min: heartRateMin, max: heartRateMax }
      },
      calories: {
        ...fitnessData.calories,
        summary: { total: caloriesTotal, average: caloriesAverage }
      }
    });
  }, [fitnessData]);

  return processedData;
};
