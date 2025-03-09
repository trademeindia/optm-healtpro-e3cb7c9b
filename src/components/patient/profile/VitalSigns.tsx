
import React from 'react';
import VitalSignCard from './VitalSignCard';
import { Heart, Activity, Thermometer, Lung } from 'lucide-react';

interface VitalSignsProps {
  vitalSigns?: Array<{
    label: string;
    value: string;
    unit: string;
    status: 'normal' | 'warning' | 'critical';
    icon?: React.ReactNode;
  }>;
}

const VitalSigns: React.FC<VitalSignsProps> = ({ vitalSigns }) => {
  const defaultVitals = [
    {
      label: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal' as const,
      icon: <Heart className="h-4 w-4 text-muted-foreground" />
    },
    {
      label: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal' as const,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />
    },
    {
      label: 'Body Temperature',
      value: '98.6',
      unit: '°F',
      status: 'normal' as const,
      icon: <Thermometer className="h-4 w-4 text-muted-foreground" />
    },
    {
      label: 'Respiratory Rate',
      value: '16',
      unit: 'bpm',
      status: 'normal' as const,
      icon: <Lung className="h-4 w-4 text-muted-foreground" />
    }
  ];

  const vitals = vitalSigns || defaultVitals;

  return (
    <div>
      <h3 className="font-medium text-sm mb-3">Vital signs</h3>
      <div className="grid grid-cols-2 gap-3">
        {vitals.map((vital, index) => (
          <VitalSignCard
            key={index}
            label={vital.label}
            value={vital.value}
            unit={vital.unit}
            status={vital.status}
            icon={vital.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default VitalSigns;
