
import React from 'react';
import { Card } from '@/components/ui/card';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

interface BiomarkersDisplayProps {
  biomarkers: Record<string, any>;
  angles: BodyAngles;
}

const BiomarkersDisplay: React.FC<BiomarkersDisplayProps> = ({ biomarkers, angles }) => {
  // Format values for display
  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return value.toString();
  };

  // Display angles in a readable format
  const renderAngles = () => {
    return Object.entries(angles)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => (
        <div key={key} className="flex justify-between items-center border-b pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
          <span className="text-sm capitalize">{key.replace('Angle', ' Angle')}</span>
          <span className="font-semibold text-sm">{formatValue(value)}°</span>
        </div>
      ));
  };

  // Display biomarkers in a readable format
  const renderBiomarkers = () => {
    return Object.entries(biomarkers).map(([key, value]) => (
      <div key={key} className="flex justify-between items-center border-b pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
        <span className="text-sm capitalize">{key}</span>
        <span className="font-semibold text-sm">{formatValue(value)}</span>
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Angles Card */}
      <Card className="p-4 border">
        <h3 className="font-medium text-base mb-3">Body Angles</h3>
        <div className="space-y-1">
          {renderAngles()}
        </div>
      </Card>

      {/* Biomarkers Card */}
      {Object.keys(biomarkers).length > 0 && (
        <Card className="p-4 border">
          <h3 className="font-medium text-base mb-3">Motion Biomarkers</h3>
          <div className="space-y-1">
            {renderBiomarkers()}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BiomarkersDisplay;
