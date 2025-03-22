
import * as posenet from '@tensorflow-models/posenet';
import { SquatState } from '../types';

export interface RendererProps {
  pose: posenet.Pose;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
  config: any;
}

export interface AngleDisplayProps {
  pose: posenet.Pose;
  angle: number | null;
  label: string;
  keypoint: string;
  scaleX: number;
  scaleY: number;
  minPartConfidence: number;
  offsetX?: number;
  offsetY?: number;
}

// Add the missing type definitions
export interface KeypointProps {
  keypoint: posenet.Keypoint;
  scaleX: number;
  scaleY: number;
  minPartConfidence: number;
}

export interface SkeletonProps {
  pose: posenet.Pose;
  scaleX: number;
  scaleY: number;
  minPartConfidence: number;
}

export interface StateInfoProps {
  currentSquatState: SquatState;
  poseScore: number | null;
}
