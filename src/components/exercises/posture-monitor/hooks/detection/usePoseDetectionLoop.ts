
import { useDetectionLoop } from './useDetectionLoop';
import type { DetectionStatus } from './types';
import type { UsePoseDetectionLoopProps } from './types';

export type { DetectionStatus };

export const usePoseDetectionLoop = (props: UsePoseDetectionLoopProps) => {
  return useDetectionLoop(props);
};
