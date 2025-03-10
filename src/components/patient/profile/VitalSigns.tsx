
import React from 'react';
import VitalSignCard from './VitalSignCard';
import { Heart, Activity, Thermometer, Wind } from 'lucide-react';
import { CardGrid } from '@/components/ui/card-grid';

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
      icon: <Wind className="h-4 w-4 text-muted-foreground" />
    }
  ];

  const vitals = vitalSigns || defaultVitals;

  return (
    <div>
      <h3 className="font-medium text-sm mb-3">Vital signs</h3>
      <CardGrid columns={2} gap="sm">
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
      </CardGrid>
    </div>
  );
};

export default VitalSigns;
