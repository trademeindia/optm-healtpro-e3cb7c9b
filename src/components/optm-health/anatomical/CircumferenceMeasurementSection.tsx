
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CircumferenceMeasurement from './CircumferenceMeasurement';

interface MeasurementBase {
  value: number;
  unit: 'cm' | 'mm';
  location: string;
}

interface SidedMeasurement extends MeasurementBase {
  side: 'left' | 'right' | 'bilateral';
}

type CircumferenceMeasurementType = 'ccm' | 'cap' | 'cbp';

interface CircumferenceMeasurementSectionProps {
  type: CircumferenceMeasurementType;
  title: string;
  measurements: (MeasurementBase | SidedMeasurement)[];
  onChange: (type: CircumferenceMeasurementType, index: number, field: string, value: any) => void;
  onRemove: (type: CircumferenceMeasurementType, index: number) => void;
  onAdd: (type: CircumferenceMeasurementType) => void;
  hasSide?: boolean;
}

const CircumferenceMeasurementSection: React.FC<CircumferenceMeasurementSectionProps> = ({
  type,
  title,
  measurements,
  onChange,
  onRemove,
  onAdd,
  hasSide = false
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => onAdd(type)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Measurement
        </Button>
      </div>
      
      {measurements.map((measurement, index) => (
        <CircumferenceMeasurement
          key={index}
          type={type}
          index={index}
          measurement={measurement}
          onChange={onChange}
          onRemove={onRemove}
          hasSide={hasSide}
        />
      ))}
    </div>
  );
};

export default CircumferenceMeasurementSection;
