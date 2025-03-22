
import React from 'react';
import { Result } from './types';

interface PoseRendererProps {
  result: Result;
}

const PoseRenderer: React.FC<PoseRendererProps> = ({ result }) => {
  // This is a placeholder component. Most of the actual rendering is done directly
  // in the MotionTracker component using the human.draw methods
  return null;
};

export default PoseRenderer;
