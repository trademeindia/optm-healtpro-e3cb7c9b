
import { ChartData } from './types';

/**
 * Calculates the average pain reduction percentage across all symptoms
 * @param symptoms Array of symptom data
 * @returns Rounded percentage of pain reduction
 */
export const calculatePainReduction = (symptoms: ChartData[]): number => {
  if (!symptoms.length) return 0;
  
  const reductions = symptoms.map(symptom => {
    if (!symptom.data.length) return 0;
    
    const firstValue = symptom.data[0].value;
    const lastValue = symptom.data[symptom.data.length - 1].value;
    return firstValue === 0 ? 0 : (firstValue - lastValue) / firstValue * 100;
  });
  
  const avgReduction = reductions.reduce((sum, value) => sum + value, 0) / reductions.length;
  return Math.round(avgReduction);
};

/**
 * Prepares the data for the chart component by combining all symptom datasets
 * @param symptoms Array of symptom data
 * @returns Formatted data ready for Recharts
 */
export const prepareChartData = (symptoms: ChartData[]) => {
  if (!symptoms.length || !symptoms[0].data.length) return [];
  
  return symptoms[0].data.map((item, index) => {
    const dataPoint: any = {
      name: item.name
    };
    symptoms.forEach(symptom => {
      if (symptom.data[index]) {
        dataPoint[symptom.symptomName] = symptom.data[index].value;
      }
    });
    return dataPoint;
  });
};
