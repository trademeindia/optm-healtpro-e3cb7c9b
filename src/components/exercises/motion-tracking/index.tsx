
import React from 'react';
import { Card } from '@/components/ui/card';
import MotionTrackingContainer from './components/MotionTrackingContainer';

interface MotionTrackingProps {
  exerciseId?: string;
  exerciseName?: string;
  onFinish?: () => void;
}

const MotionTracking: React.FC<MotionTrackingProps> = ({ 
  exerciseId = 'default-exercise',
  exerciseName = 'Motion Analysis',
  onFinish
}) => {
  return (
    <Card className="w-full overflow-hidden border shadow-sm">
      <MotionTrackingContainer 
        exerciseId={exerciseId}
        exerciseName={exerciseName}
        onFinish={onFinish}
      />
    </Card>
  );
};

export default MotionTracking;
