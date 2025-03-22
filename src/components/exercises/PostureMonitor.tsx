
import React, { useEffect } from 'react';
import { MotionTracker } from './motion-tracker';
import { toast } from 'sonner';

interface PostureMonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

// Enhanced version with proper initialization
const PostureMonitor: React.FC<PostureMonitorProps> = (props) => {
  const { exerciseId, exerciseName } = props;

  // Log component mounting and props
  useEffect(() => {
    console.log("PostureMonitor mounted with props:", {
      exerciseId,
      exerciseName
    });

    // Show toast when an exercise is selected
    if (exerciseId && exerciseName) {
      toast.info(`Starting ${exerciseName}`, {
        description: "Prepare for your guided workout session"
      });
    }
  }, [exerciseId, exerciseName]);

  return <MotionTracker {...props} />;
};

export default PostureMonitor;
