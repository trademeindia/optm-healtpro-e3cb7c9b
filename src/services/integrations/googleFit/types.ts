
export interface GoogleFitDataPoint {
  startTime: string;
  endTime: string;
  value: number;
  dataType: string;
}

export interface GoogleFitSyncResult {
  success: boolean;
  data: FitnessData;
  message: string;
  timestamp: string;
}

import { FitnessData } from '@/hooks/useFitnessIntegration';

// Config constants
export const GOOGLE_FIT_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Publishable key - replace with your actual client ID
export const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.location.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.nutrition.read'
].join(' ');
