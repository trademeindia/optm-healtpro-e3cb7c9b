
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MusculoskeletalBiomarkers, BIOMARKER_REFERENCE_RANGES } from '@/types/optm-health';

interface BiomarkerFieldProps {
  biomarker: keyof MusculoskeletalBiomarkers;
  value: number | undefined;
  onChange: (biomarker: keyof MusculoskeletalBiomarkers, value: string) => void;
}

const BiomarkerField: React.FC<BiomarkerFieldProps> = ({
  biomarker,
  value,
  onChange
}) => {
  const range = BIOMARKER_REFERENCE_RANGES[biomarker];
  
  return (
    <div className="space-y-2">
      <Label htmlFor={biomarker}>
        {biomarker} {range ? `(${range.unit})` : ''}
      </Label>
      <Input 
        id={biomarker} 
        type="number"
        step="0.01"
        value={value ?? ''} 
        onChange={(e) => onChange(biomarker, e.target.value)}
        placeholder={range ? `Normal: ${range.min} - ${range.max}` : ''}
      />
    </div>
  );
};

export default BiomarkerField;
