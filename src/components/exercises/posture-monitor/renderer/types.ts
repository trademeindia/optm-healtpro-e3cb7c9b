
import * as posenet from '@tensorflow-models/posenet';
import { SquatState } from '../types';
import { PoseDetectionConfig } from '../poseDetectionTypes';

export interface RendererProps {
  pose: posenet.Pose | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
  config?: PoseDetectionConfig;
}
