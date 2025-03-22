
import React from 'react';
import { MotionTracker } from './motion-tracker';

interface PostureMonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

// Re-export the component with the same interface to maintain compatibility
const PostureMonitor: React.FC<PostureMonitorProps> = (props) => {
  return <MotionTracker {...props} />;
};

export default PostureMonitor;
