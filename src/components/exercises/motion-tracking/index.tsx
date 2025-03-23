
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import MotionDetectionErrorBoundary from './components/MotionDetectionErrorBoundary';
import MotionTrackingContainer from './components/MotionTrackingContainer';

interface MotionTrackingProps {
  exerciseId?: string;
  exerciseName?: string;
}

const MotionTracking: React.FC<MotionTrackingProps> = ({ 
  exerciseId = 'default-exercise',
  exerciseName = 'Motion Analysis'
}) => {
  return (
    <Card className="w-full overflow-hidden border shadow-sm">
      <MotionTrackingContainer 
        exerciseId={exerciseId}
        exerciseName={exerciseName}
      />
    </Card>
  );
};

export default MotionTracking;
