
import { FitnessData } from '@/types/medicalData';
import { mockActivityData } from './mockData';

export interface ActivityData {
  data: { day: string; value: number }[];
  currentValue: number;
  source?: string;
  lastSync?: string;
}

export const useActivityData = (fitnessData: FitnessData): ActivityData => {
  const getSteps = (): ActivityData => {
    return fitnessData.steps ? {
      data: mockActivityData,
      currentValue: Number(fitnessData.steps.value),
      source: fitnessData.steps.source,
      lastSync: new Date(fitnessData.steps.timestamp).toLocaleTimeString()
    } : { data: mockActivityData, currentValue: 8152 };
  };

  return getSteps();
};
