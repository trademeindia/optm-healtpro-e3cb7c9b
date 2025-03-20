
import React from 'react';
import { Separator } from '@/components/ui/separator';
import BiomarkerField from './BiomarkerField';
import { MusculoskeletalBiomarkers } from '@/types/optm-health';

interface BiomarkersTabProps {
  biomarkers: MusculoskeletalBiomarkers;
  onBiomarkerChange: (marker: keyof MusculoskeletalBiomarkers, value: string) => void;
}

const BiomarkersTab: React.FC<BiomarkersTabProps> = ({
  biomarkers,
  onBiomarkerChange
}) => {
  const inflammatoryMarkers: (keyof MusculoskeletalBiomarkers)[] = ['crp', 'il6', 'tnfAlpha', 'mda'];
  const tissueRepairMarkers: (keyof MusculoskeletalBiomarkers)[] = ['vegf', 'tgfBeta'];
  const cartilageMarkers: (keyof MusculoskeletalBiomarkers)[] = ['comp', 'mmp9', 'mmp13'];
  const additionalMarkers: (keyof MusculoskeletalBiomarkers)[] = [
    'ckMm', 'bdnf', 'substanceP', 'dDimer', 'fourHyp', 'aldolase', 'calciumPhosphorusRatio'
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 mb-2">
          <h3 className="text-lg font-medium">Inflammatory Markers</h3>
          <p className="text-sm text-muted-foreground">Enter current biomarker values</p>
        </div>
        
        {inflammatoryMarkers.map(biomarker => (
          <BiomarkerField 
            key={biomarker}
            biomarker={biomarker}
            value={biomarkers[biomarker]}
            onChange={onBiomarkerChange}
          />
        ))}
        
        <div className="md:col-span-2 mt-2 mb-2">
          <Separator />
          <h3 className="text-lg font-medium mt-4">Tissue Repair Markers</h3>
        </div>
        
        {tissueRepairMarkers.map(biomarker => (
          <BiomarkerField 
            key={biomarker}
            biomarker={biomarker}
            value={biomarkers[biomarker]}
            onChange={onBiomarkerChange}
          />
        ))}
        
        <div className="md:col-span-2 mt-2 mb-2">
          <Separator />
          <h3 className="text-lg font-medium mt-4">Cartilage Degradation Markers</h3>
        </div>
        
        {cartilageMarkers.map(biomarker => (
          <BiomarkerField 
            key={biomarker}
            biomarker={biomarker}
            value={biomarkers[biomarker]}
            onChange={onBiomarkerChange}
          />
        ))}
        
        <div className="md:col-span-2 mt-2 mb-2">
          <Separator />
          <h3 className="text-lg font-medium mt-4">Additional Markers</h3>
        </div>
        
        {additionalMarkers.map(biomarker => (
          <BiomarkerField 
            key={biomarker}
            biomarker={biomarker}
            value={biomarkers[biomarker]}
            onChange={onBiomarkerChange}
          />
        ))}
      </div>
    </div>
  );
};

export default BiomarkersTab;
