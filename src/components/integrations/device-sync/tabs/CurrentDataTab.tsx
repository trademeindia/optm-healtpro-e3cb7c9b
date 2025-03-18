
import React from 'react';
import HealthMetric from '@/components/dashboard/HealthMetric';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { getMetricIcon } from '../utils';

interface CurrentDataTabProps {
  healthData: FitnessData;
  providerName: string;
  lastSyncTime?: string;
}

const CurrentDataTab: React.FC<CurrentDataTabProps> = ({ 
  healthData, 
  providerName, 
  lastSyncTime 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {healthData.steps && (
        <HealthMetric
          title="Steps"
          value={healthData.steps.value}
          unit={healthData.steps.unit}
          change={healthData.steps.change}
          icon={getMetricIcon('steps')}
          color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          source={providerName}
          lastSync={lastSyncTime}
          isConnected={true}
        />
      )}
      
      {healthData.heartRate && (
        <HealthMetric
          title="Heart Rate"
          value={healthData.heartRate.value}
          unit={healthData.heartRate.unit}
          change={healthData.heartRate.change}
          icon={getMetricIcon('heart rate')}
          color="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
          source={providerName}
          lastSync={lastSyncTime}
          isConnected={true}
        />
      )}
      
      {healthData.calories && (
        <HealthMetric
          title="Calories"
          value={healthData.calories.value}
          unit={healthData.calories.unit}
          change={healthData.calories.change}
          icon={getMetricIcon('calories')}
          color="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
          source={providerName}
          lastSync={lastSyncTime}
          isConnected={true}
        />
      )}
      
      {healthData.distance && (
        <HealthMetric
          title="Distance"
          value={healthData.distance.value}
          unit={healthData.distance.unit}
          change={healthData.distance.change}
          icon={getMetricIcon('distance')}
          color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
          source={providerName}
          lastSync={lastSyncTime}
          isConnected={true}
        />
      )}
      
      {healthData.sleep && (
        <HealthMetric
          title="Sleep"
          value={healthData.sleep.value}
          unit={healthData.sleep.unit}
          change={healthData.sleep.change}
          icon={getMetricIcon('sleep')}
          color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
          source={providerName}
          lastSync={lastSyncTime}
          isConnected={true}
        />
      )}
      
      {healthData.activeMinutes && (
        <HealthMetric
          title="Active Minutes"
          value={healthData.activeMinutes.value}
          unit={healthData.activeMinutes.unit}
          change={healthData.activeMinutes.change}
          icon={getMetricIcon('active minutes')}
          color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          source={providerName}
          lastSync={lastSyncTime}
          isConnected={true}
        />
      )}
      
      {Object.keys(healthData).length === 0 && (
        <div className="text-center py-8 text-muted-foreground col-span-3">
          <p>No health data available. Click "Sync Now" to fetch your latest data.</p>
        </div>
      )}
    </div>
  );
};

export default CurrentDataTab;
