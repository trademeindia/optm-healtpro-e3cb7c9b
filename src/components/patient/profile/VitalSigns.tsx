
import React from 'react';
import { Heart, Activity, Droplet, Thermometer } from 'lucide-react';
import VitalSignCard from './VitalSignCard';

interface VitalSignsProps {
  vitalSigns: Array<{
    label: string;
    value: string;
    unit: string;
    status: 'warning' | 'normal';
    icon?: React.ReactNode;
  }>;
}

const VitalSigns: React.FC<VitalSignsProps> = ({ vitalSigns }) => {
  const getIconForVital = (index: number, status: 'warning' | 'normal') => {
    const color = status === 'warning' ? 'text-orange-500' : 'text-green-500';
    switch (index) {
      case 0: return <Droplet className={`h-4 w-4 ${color}`} />;
      case 1: return <Activity className={`h-4 w-4 ${color}`} />;
      case 2: return <Heart className={`h-4 w-4 ${color}`} />;
      case 3: return <Droplet className={`h-4 w-4 ${color}`} />;
      default: return <Thermometer className={`h-4 w-4 ${color}`} />;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {vitalSigns.map((vital, index) => (
        <VitalSignCard
          key={index}
          label={vital.label}
          value={vital.value}
          unit={vital.unit}
          status={vital.status}
          icon={vital.icon || getIconForVital(index, vital.status)}
        />
      ))}
    </div>
  );
};

export default VitalSigns;
