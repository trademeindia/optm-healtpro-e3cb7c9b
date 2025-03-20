
import React from 'react';
import { Separator } from '@/components/ui/separator';
import MobilityMeasurementField from './MobilityMeasurementField';
import { MobilityMeasurements } from '@/types/optm-health';

interface MobilityTabProps {
  mobilityMeasurements: MobilityMeasurements;
  onMobilityChange: (measurement: keyof MobilityMeasurements, field: string, value: any) => void;
}

const MobilityTab: React.FC<MobilityTabProps> = ({
  mobilityMeasurements,
  onMobilityChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Knee Measurements</h3>
        
        <MobilityMeasurementField
          label="Knee Flexion"
          measurement="kneeFlexion"
          value={mobilityMeasurements?.kneeFlexion}
          normalRange="135-150°"
          onChange={onMobilityChange}
          hasSide
        />
        
        <MobilityMeasurementField
          label="Knee Extension"
          measurement="kneeExtension"
          value={mobilityMeasurements?.kneeExtension}
          normalRange="0° (neutral)"
          onChange={onMobilityChange}
          hasSide
        />
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Pelvic Measurements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <MobilityMeasurementField
              label="Pelvic Tilt Angle"
              measurement="pelvicTilt"
              value={mobilityMeasurements?.pelvicTilt}
              normalRange="4-7°"
              onChange={onMobilityChange}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Additional Measurements</h3>
        
        <MobilityMeasurementField
          label="Cervical Rotation"
          measurement="cervicalRotation"
          value={mobilityMeasurements?.cervicalRotation}
          normalRange="70-90°"
          onChange={onMobilityChange}
          hasDirection
        />
        
        <MobilityMeasurementField
          label="Shoulder Flexion"
          measurement="shoulderFlexion"
          value={mobilityMeasurements?.shoulderFlexion}
          normalRange="150-180°"
          onChange={onMobilityChange}
          hasSide
        />
      </div>
    </div>
  );
};

export default MobilityTab;
