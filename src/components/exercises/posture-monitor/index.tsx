
import React, { useRef, useState, useEffect } from 'react';
import CameraView from './CameraView';
import { useCamera } from './camera';
import { SquatState, FeedbackType } from './types';
import { determineSquatState } from './utils';
import useSquatCounter from './hooks/useSquatCounter';
import { DetectionStatus } from '@/lib/human/types';

// Placeholder for missing components
const PoseRenderer = ({ canvasRef, detectedPose }: { canvasRef: React.RefObject<HTMLCanvasElement>, detectedPose: any }) => {
  return null;
};

const PostureMonitor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [squatState, setSquatState] = useState<SquatState>(SquatState.STANDING);
  const [kneeAngle, setKneeAngle] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.INFO);
  const [detectedPose, setDetectedPose] = useState<any>(null);
  const { squatCount, incrementSquatCount } = useSquatCounter();
  
  // Setup camera
  const {
    cameraActive,
    videoRef,
    toggleCamera,
    stopCamera,
    cameraError,
    retryCamera,
    videoStatus
  } = useCamera({
    onCameraStart: () => setVideoReady(true)
  });
  
  useEffect(() => {
    // Cleanup
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  // Handle squats
  useEffect(() => {
    if (!kneeAngle) return;
    
    const newSquatState = determineSquatState(kneeAngle, squatState);
    
    if (newSquatState !== squatState) {
      setSquatState(newSquatState);
      
      // Count when going from BOTTOM to ASCENDING
      if (squatState === SquatState.BOTTOM && newSquatState === SquatState.ASCENDING) {
        incrementSquatCount();
        setFeedback("Great job! Squat completed.");
        setFeedbackType(FeedbackType.SUCCESS);
      }
    }
  }, [kneeAngle, squatState, incrementSquatCount]);
  
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
        <div className="relative aspect-video">
          <CameraView
            cameraActive={cameraActive}
            isModelLoading={false}
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraError={cameraError}
            onRetryCamera={retryCamera}
            detectionStatus={{
              isDetecting: cameraActive,
              fps: 0,
              confidence: null,
              detectedKeypoints: 0,
              lastDetectionTime: Date.now()
            } as DetectionStatus}
          />
          
          <PoseRenderer
            canvasRef={canvasRef}
            detectedPose={detectedPose}
          />
        </div>
        
        <div className="p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">
              Posture Monitor
            </div>
            
            <button
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
              onClick={() => toggleCamera()}
            >
              {cameraActive ? 'Stop Camera' : 'Start Camera'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium mb-2">Exercise Stats</h3>
          <p>Squats completed: {squatCount}</p>
          <p>Current state: {squatState}</p>
          {kneeAngle && <p>Knee angle: {kneeAngle.toFixed(1)}°</p>}
        </div>
        
        <div className={`bg-card p-4 rounded-lg shadow-sm border ${
          feedbackType === FeedbackType.SUCCESS ? 'border-green-500' :
          feedbackType === FeedbackType.WARNING ? 'border-yellow-500' :
          feedbackType === FeedbackType.ERROR ? 'border-red-500' : ''
        }`}>
          <h3 className="font-medium mb-2">Feedback</h3>
          <p>{feedback || "Position yourself in the camera view"}</p>
        </div>
      </div>
    </div>
  );
};

export default PostureMonitor;
