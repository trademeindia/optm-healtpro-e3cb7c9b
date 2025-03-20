
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CircumferenceMeasurementSection from './CircumferenceMeasurementSection';
import { AnatomicalMeasurements } from '@/types/optm-health';

interface AnatomicalTabProps {
  anatomicalMeasurements: AnatomicalMeasurements;
  onAnatomicalCtmChange: (value: string) => void;
  onCircumferenceChange: (type: 'ccm' | 'cap' | 'cbp', index: number, field: string, value: any) => void;
  onAddCircumference: (type: 'ccm' | 'cap' | 'cbp') => void;
  onRemoveCircumference: (type: 'ccm' | 'cap' | 'cbp', index: number) => void;
}

const AnatomicalTab: React.FC<AnatomicalTabProps> = ({
  anatomicalMeasurements,
  onAnatomicalCtmChange,
  onCircumferenceChange,
  onAddCircumference,
  onRemoveCircumference
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Cervical Translational Measurement (CTM)</h3>
        <div className="space-y-2">
          <Label htmlFor="ctm">CTM Value (mm)</Label>
          <Input 
            id="ctm"
            type="number"
            step="0.1"
            value={anatomicalMeasurements?.ctm ?? ''} 
            onChange={(e) => onAnatomicalCtmChange(e.target.value)}
            placeholder="Enter CTM value in mm"
          />
        </div>
      </div>
      
      <Separator />
      
      <CircumferenceMeasurementSection
        type="ccm"
        title="Cervical Circumference Measurements (CCM)"
        measurements={anatomicalMeasurements?.ccm || []}
        onChange={onCircumferenceChange}
        onRemove={onRemoveCircumference}
        onAdd={onAddCircumference}
      />
      
      <Separator />
      
      <CircumferenceMeasurementSection
        type="cap"
        title="Circumference Arm Posterior (CAP)"
        measurements={anatomicalMeasurements?.cap || []}
        onChange={onCircumferenceChange}
        onRemove={onRemoveCircumference}
        onAdd={onAddCircumference}
        hasSide
      />
      
      <Separator />
      
      <CircumferenceMeasurementSection
        type="cbp"
        title="Circumference Brachial Posterior (CBP)"
        measurements={anatomicalMeasurements?.cbp || []}
        onChange={onCircumferenceChange}
        onRemove={onRemoveCircumference}
        onAdd={onAddCircumference}
        hasSide
      />
    </div>
  );
};

export default AnatomicalTab;
