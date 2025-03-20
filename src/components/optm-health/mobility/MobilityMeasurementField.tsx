
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MobilityMeasurements } from '@/types/optm-health';

interface MobilityMeasurementFieldProps {
  label: string;
  measurement: keyof MobilityMeasurements;
  value?: { 
    value: number;
    unit?: string;
    side?: 'left' | 'right' | 'bilateral';
    direction?: 'left' | 'right';
  };
  normalRange?: string;
  onChange: (measurement: keyof MobilityMeasurements, field: string, value: any) => void;
  hasSide?: boolean;
  hasDirection?: boolean;
}

const MobilityMeasurementField: React.FC<MobilityMeasurementFieldProps> = ({
  label,
  measurement,
  value,
  normalRange,
  onChange,
  hasSide = false,
  hasDirection = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor={`${measurement}-value`}>{label} (degrees)</Label>
        <Input 
          id={`${measurement}-value`}
          type="number"
          step="0.1"
          value={value?.value ?? ''} 
          onChange={(e) => onChange(measurement, 'value', e.target.value)}
          placeholder={normalRange ? `Normal: ${normalRange}` : ''}
        />
      </div>
      
      {hasSide && (
        <div className="space-y-2">
          <Label htmlFor={`${measurement}-side`}>Side</Label>
          <Select
            value={value?.side}
            onValueChange={(sideValue: 'left' | 'right' | 'bilateral') => 
              onChange(measurement, 'side', sideValue)
            }
          >
            <SelectTrigger id={`${measurement}-side`}>
              <SelectValue placeholder="Select side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="bilateral">Bilateral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {hasDirection && (
        <div className="space-y-2">
          <Label htmlFor={`${measurement}-direction`}>Direction</Label>
          <Select
            value={value?.direction}
            onValueChange={(directionValue: 'left' | 'right') => 
              onChange(measurement, 'direction', directionValue)
            }
          >
            <SelectTrigger id={`${measurement}-direction`}>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor={`${measurement}-unit`}>Unit</Label>
        <Input 
          id={`${measurement}-unit`}
          value="degrees"
          disabled
        />
      </div>
    </div>
  );
};

export default MobilityMeasurementField;
