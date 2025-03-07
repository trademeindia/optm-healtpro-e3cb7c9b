
import { ChartData } from './types';

export const calculatePainReduction = (symptoms: ChartData[]): number => {
  const reductions = symptoms.map(symptom => {
    const firstValue = symptom.data[0].value;
    const lastValue = symptom.data[symptom.data.length - 1].value;
    return (firstValue - lastValue) / firstValue * 100;
  });
  const avgReduction = reductions.reduce((sum, value) => sum + value, 0) / reductions.length;
  return Math.round(avgReduction);
};

export const prepareChartData = (symptoms: ChartData[]) => {
  return symptoms[0].data.map((item, index) => {
    const dataPoint: any = {
      name: item.name
    };
    symptoms.forEach(symptom => {
      dataPoint[symptom.symptomName] = symptom.data[index].value;
    });
    return dataPoint;
  });
};
