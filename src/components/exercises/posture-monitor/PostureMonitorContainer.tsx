
import React from 'react';
import { PostureMonitorProvider } from './context/PostureMonitorProvider';
import PostureMonitorView from './views/PostureMonitorView';
import ExerciseSelectionView from './ExerciseSelectionView';

interface PostureMonitorContainerProps {
  exerciseId: string | null;
  exerciseName: string | null;
  onFinish: () => void;
}

const PostureMonitorContainer: React.FC<PostureMonitorContainerProps> = ({
  exerciseId,
  exerciseName,
  onFinish
}) => {
  if (!exerciseId || !exerciseName) {
    return <ExerciseSelectionView />;
  }

  return (
    <PostureMonitorProvider 
      exerciseId={exerciseId} 
      exerciseName={exerciseName} 
      onFinish={onFinish}
    >
      <PostureMonitorView exerciseName={exerciseName} />
    </PostureMonitorProvider>
  );
};

export default PostureMonitorContainer;
