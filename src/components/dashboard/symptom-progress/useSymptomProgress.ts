
import { useState, useMemo } from 'react';
import { getSymptomsMockData } from './mockData';
import { ChartData } from './types';
import { calculatePainReduction, prepareChartData } from './utils';

export const useSymptomProgress = () => {
  // Get mock data for symptom tracking
  const [symptoms, setSymptoms] = useState<ChartData[]>(getSymptomsMockData());

  // Combined data for the chart
  const chartData = useMemo(() => prepareChartData(symptoms), [symptoms]);

  // Calculate average pain reduction
  const painReduction = useMemo(() => calculatePainReduction(symptoms), [symptoms]);

  return {
    symptoms,
    chartData,
    painReduction,
    setSymptoms,
  };
};
