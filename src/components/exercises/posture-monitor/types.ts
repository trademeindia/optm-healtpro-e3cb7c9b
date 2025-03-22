
// Exercise analysis state
export enum SquatState {
  STANDING = 'standing',
  DESCENDING = 'descending',
  BOTTOM = 'bottom',
  ASCENDING = 'ascending',
  UNKNOWN = 'unknown'
}

// Feedback types
export enum FeedbackType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// Human detection status from Human.js
export interface HumanDetectionStatus {
  isActive: boolean;
  fps: number | null;
  confidence: number | null;
}

// Renderer props
export interface RendererProps {
  pose: any;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
  config: any;
}
