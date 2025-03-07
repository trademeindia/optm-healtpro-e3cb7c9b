
import React from 'react';
import MonitorContainer from './components/MonitorContainer';
import NoExerciseSelected from './components/NoExerciseSelected';

interface PostureMonitorProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

const PostureMonitor: React.FC<PostureMonitorProps> = ({
  exerciseId,
  exerciseName,
  onFinish,
}) => {
  if (!exerciseId || !exerciseName) {
    return <NoExerciseSelected />;
  }

  return (
    <MonitorContainer
      exerciseId={exerciseId}
      exerciseName={exerciseName}
      onFinish={onFinish}
    />
  );
};

export default PostureMonitor;
