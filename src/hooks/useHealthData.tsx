
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface HealthMetric {
  currentValue: number | string;
  unit: string;
  change: number;
  data: { date: string; value: number }[];
  source?: string;
  lastSync?: string;
}

export const useHealthData = () => {
  const { toast } = useToast();
  const [hasConnectedApps, setHasConnectedApps] = useState(true);
  
  // Mock health metrics data
  const [healthMetrics, setHealthMetrics] = useState({
    steps: {
      currentValue: 8423,
      unit: 'steps',
      change: 12,
      data: [
        { date: '05/01', value: 7200 },
        { date: '05/02', value: 8100 },
        { date: '05/03', value: 7600 },
        { date: '05/04', value: 9200 },
        { date: '05/05', value: 8700 },
        { date: '05/06', value: 7900 },
        { date: '05/07', value: 8423 }
      ],
      source: 'Apple Health',
      lastSync: '10 minutes ago'
    } as HealthMetric,
    heartRate: {
      currentValue: 72,
      unit: 'bpm',
      change: -5,
      data: [
        { date: '05/01', value: 75 },
        { date: '05/02', value: 78 },
        { date: '05/03', value: 76 },
        { date: '05/04', value: 74 },
        { date: '05/05', value: 73 },
        { date: '05/06', value: 75 },
        { date: '05/07', value: 72 }
      ],
      source: 'Fitbit',
      lastSync: '30 minutes ago'
    } as HealthMetric,
    bloodPressure: {
      currentValue: '120/80',
      unit: 'mmHg',
      change: 0,
      data: [
        { date: '05/01', value: 125 },
        { date: '05/02', value: 122 },
        { date: '05/03', value: 121 },
        { date: '05/04', value: 123 },
        { date: '05/05', value: 120 },
        { date: '05/06', value: 121 },
        { date: '05/07', value: 120 }
      ],
      source: 'Samsung Health',
      lastSync: '1 hour ago'
    } as HealthMetric,
    temperature: {
      currentValue: 98.6,
      unit: '°F',
      change: 0.2,
      data: [
        { date: '05/01', value: 98.4 },
        { date: '05/02', value: 98.5 },
        { date: '05/03', value: 98.7 },
        { date: '05/04', value: 98.5 },
        { date: '05/05', value: 98.4 },
        { date: '05/06', value: 98.5 },
        { date: '05/07', value: 98.6 }
      ],
      source: 'Smart Thermometer',
      lastSync: '2 days ago'
    } as HealthMetric,
    oxygen: {
      currentValue: 98,
      unit: '%',
      change: 1,
      data: [
        { date: '05/01', value: 97 },
        { date: '05/02', value: 97 },
        { date: '05/03', value: 96 },
        { date: '05/04', value: 97 },
        { date: '05/05', value: 98 },
        { date: '05/06', value: 97 },
        { date: '05/07', value: 98 }
      ],
      source: 'Pulse Oximeter',
      lastSync: '1 day ago'
    } as HealthMetric
  });
  
  // Handle syncing all health data
  const handleSyncAllData = () => {
    toast({
      title: "Syncing Data",
      description: "Syncing all health data from connected apps"
    });
    
    // Simulate successful data sync
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "All health data has been updated successfully"
      });
    }, 2000);
  };
  
  return {
    hasConnectedApps,
    healthMetrics,
    handleSyncAllData
  };
};
