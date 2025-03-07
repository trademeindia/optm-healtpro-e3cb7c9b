
import React from 'react';
import { Heart, Activity, Thermometer, Droplet } from 'lucide-react';
import HealthMetric from '@/components/dashboard/HealthMetric';

interface HealthData {
  value: number | string;
  unit: string;
  change: number;
  source?: string;
  lastSync?: string;
}

interface HealthMetricsGridProps {
  heartRate: HealthData;
  bloodPressure: HealthData;
  temperature: HealthData;
  oxygen: HealthData;
}

const HealthMetricsGrid: React.FC<HealthMetricsGridProps> = ({
  heartRate,
  bloodPressure,
  temperature,
  oxygen,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <HealthMetric
        title="Heart Rate"
        value={heartRate.value}
        unit={heartRate.unit}
        change={heartRate.change}
        changeLabel="vs last week"
        icon={<Heart className="w-4 h-4" />}
        color="bg-medical-red/10 text-medical-red"
        source={heartRate.source}
        lastSync={heartRate.lastSync}
        isConnected={!!heartRate.source}
      />
      
      <HealthMetric
        title="Blood Pressure"
        value={bloodPressure.value}
        unit={bloodPressure.unit}
        change={bloodPressure.change}
        changeLabel="stable"
        icon={<Activity className="w-4 h-4" />}
        color="bg-medical-blue/10 text-medical-blue"
        source={bloodPressure.source}
        lastSync={bloodPressure.lastSync}
        isConnected={!!bloodPressure.source}
      />
      
      <HealthMetric
        title="Temperature"
        value={temperature.value}
        unit={temperature.unit}
        change={temperature.change}
        changeLabel="vs yesterday"
        icon={<Thermometer className="w-4 h-4" />}
        color="bg-medical-yellow/10 text-medical-yellow"
        source={temperature.source}
        lastSync={temperature.lastSync}
        isConnected={!!temperature.source}
      />
      
      <HealthMetric
        title="Oxygen"
        value={oxygen.value}
        unit={oxygen.unit}
        change={oxygen.change}
        changeLabel="vs last check"
        icon={<Droplet className="w-4 h-4" />}
        color="bg-medical-green/10 text-medical-green"
        source={oxygen.source}
        lastSync={oxygen.lastSync}
        isConnected={!!oxygen.source}
      />
    </div>
  );
};

export default HealthMetricsGrid;
