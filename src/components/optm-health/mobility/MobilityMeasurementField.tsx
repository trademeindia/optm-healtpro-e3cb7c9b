
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
  value: any;
  normalRange: string;
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
    <div className="mb-4 p-4 border rounded-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm text-muted-foreground">Normal Range: {normalRange}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`${measurement}-value`}>Value (degrees)</Label>
          <Input
            id={`${measurement}-value`}
            type="number"
            step="0.1"
            value={value?.value || ''}
            onChange={(e) => onChange(measurement, 'value', e.target.value)}
            placeholder="Enter value"
          />
        </div>
        
        {hasSide && (
          <div className="space-y-2">
            <Label htmlFor={`${measurement}-side`}>Side</Label>
            <Select
              value={value?.side || 'right'}
              onValueChange={(val) => onChange(measurement, 'side', val)}
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
              value={value?.direction || 'right'}
              onValueChange={(val) => onChange(measurement, 'direction', val)}
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
      </div>
    </div>
  );
};

export default MobilityMeasurementField;
