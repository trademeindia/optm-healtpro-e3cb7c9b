
import { useEffect, useMemo } from 'react';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { HealthMetric } from '@/types/health';
import { mockBiomarkers } from '@/data/mockBiomarkerData';

/**
 * Transforms fitness data and biomarkers into health metrics for dashboard display
 */
export const useHealthMetrics = (fitnessData?: FitnessData): HealthMetric[] => {
  return useMemo(() => {
    // Start with base health metrics
    const metrics: HealthMetric[] = [
      {
        name: 'Heart Rate',
        value: fitnessData?.heartRate?.summary?.average || 72,
        unit: 'bpm',
        status: 'normal',
        category: 'Cardiovascular',
        change: 0,
        trend: 'stable',
        id: 'metric-hr'
      },
      {
        name: 'Steps',
        value: fitnessData?.steps?.summary?.average || 8500,
        unit: 'steps',
        status: 'normal',
        category: 'Activity',
        change: fitnessData?.steps?.summary?.average ? 5 : 0,
        trend: 'up',
        id: 'metric-steps'
      },
      {
        name: 'Sleep',
        value: 7.2,
        unit: 'hours',
        status: 'normal',
        category: 'Recovery',
        change: 0.3,
        trend: 'up',
        id: 'metric-sleep'
      },
      {
        name: 'Blood Pressure',
        value: 120,
        unit: 'mmHg',
        status: 'normal',
        category: 'Cardiovascular',
        change: -2,
        trend: 'down',
        id: 'metric-bp'
      }
    ];
    
    // Add biomarker-based metrics
    mockBiomarkers.forEach(biomarker => {
      metrics.push({
        id: `metric-${biomarker.id}`,
        name: biomarker.name,
        value: biomarker.value,
        unit: biomarker.unit,
        status: biomarker.status,
        category: 'Biomarkers',
        change: 0,
        trend: biomarker.trend || 'stable',
      });
    });
    
    return metrics;
  }, [fitnessData]);
};
