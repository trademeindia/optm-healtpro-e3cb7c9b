
import React from 'react';
import { Heart, Activity, Thermometer, Droplet } from 'lucide-react';
import HealthMetric from '@/components/dashboard/HealthMetric';
import BiologicalAge from '@/components/dashboard/BiologicalAge';
import ActivityTracker from '@/components/dashboard/ActivityTracker';
import { CardGrid } from '@/components/ui/card-grid';
import { DashboardMainContentProps } from './types';

const LeftColumn: React.FC<DashboardMainContentProps> = ({
  healthMetrics,
  activityData,
  biologicalAge,
  chronologicalAge,
}) => {
  return (
    <div className="lg:col-span-3 space-y-4">
      {/* Biological Age card */}
      <BiologicalAge 
        biologicalAge={biologicalAge} 
        chronologicalAge={chronologicalAge} 
      />
      
      {/* Health Metrics grid */}
      <CardGrid columns={2} gap="sm">
        <HealthMetric
          title="Heart Rate"
          value={healthMetrics.heartRate.value}
          unit={healthMetrics.heartRate.unit}
          change={healthMetrics.heartRate.change}
          changeLabel="vs last week"
          icon={<Heart className="w-4 h-4" />}
          color="bg-medical-red/10 text-medical-red"
          source={healthMetrics.heartRate.source}
          lastSync={healthMetrics.heartRate.lastSync}
          isConnected={!!healthMetrics.heartRate.source}
        />
        
        <HealthMetric
          title="Blood Pressure"
          value={healthMetrics.bloodPressure.value}
          unit={healthMetrics.bloodPressure.unit}
          change={healthMetrics.bloodPressure.change}
          changeLabel="vs last check"
          icon={<Activity className="w-4 h-4" />}
          color="bg-medical-blue/10 text-medical-blue"
          source={healthMetrics.bloodPressure.source}
          lastSync={healthMetrics.bloodPressure.lastSync}
          isConnected={!!healthMetrics.bloodPressure.source}
        />
        
        <HealthMetric
          title="Temperature"
          value={healthMetrics.temperature.value}
          unit={healthMetrics.temperature.unit}
          change={healthMetrics.temperature.change}
          changeLabel="vs yesterday"
          icon={<Thermometer className="w-4 h-4" />}
          color="bg-medical-yellow/10 text-medical-yellow"
          source={healthMetrics.temperature.source}
          lastSync={healthMetrics.temperature.lastSync}
          isConnected={!!healthMetrics.temperature.source}
        />
        
        <HealthMetric
          title="Oxygen"
          value={healthMetrics.oxygen.value}
          unit={healthMetrics.oxygen.unit}
          change={healthMetrics.oxygen.change}
          changeLabel="vs last check"
          icon={<Droplet className="w-4 h-4" />}
          color="bg-medical-green/10 text-medical-green"
          source={healthMetrics.oxygen.source}
          lastSync={healthMetrics.oxygen.lastSync}
          isConnected={!!healthMetrics.oxygen.source}
        />
      </CardGrid>
      
      {/* Activity tracker */}
      <ActivityTracker
        title="Your Activity (Steps)"
        data={activityData.data}
        unit="steps/day"
        currentValue={activityData.currentValue}
        source={activityData.source}
        lastSync={activityData.lastSync}
      />
    </div>
  );
};

export default LeftColumn;
