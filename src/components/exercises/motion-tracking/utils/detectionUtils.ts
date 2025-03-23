
import * as Human from '@vladmandic/human';
import { human, extractBodyAngles, extractBiomarkers } from '@/lib/human';
import { BodyAngles, MotionState } from '@/components/exercises/posture-monitor/types';
import { determineMotionState } from './motionStateUtils';

/**
 * Perform Human.js detection on video element
 */
export const performDetection = async (
  videoElement: HTMLVideoElement | null
): Promise<{
  result: Human.Result | null;
  angles: BodyAngles;
  biomarkers: Record<string, any>;
  newMotionState: MotionState;
}> => {
  if (!videoElement) {
    return {
      result: null,
      angles: {
        kneeAngle: null,
        hipAngle: null,
        shoulderAngle: null,
        elbowAngle: null,
        ankleAngle: null,
        neckAngle: null
      },
      biomarkers: {},
      newMotionState: MotionState.STANDING
    };
  }
  
  try {
    // Perform detection
    const detectionResult = await human.detect(videoElement);
    
    // Default empty angles
    const defaultAngles: BodyAngles = {
      kneeAngle: null,
      hipAngle: null,
      shoulderAngle: null,
      elbowAngle: null,
      ankleAngle: null,
      neckAngle: null
    };
    
    // Extract angles and biomarkers
    let extractedAngles = defaultAngles;
    let extractedBiomarkers = {};
    let newMotionState = MotionState.STANDING;
    
    if (detectionResult.body && detectionResult.body.length > 0) {
      extractedAngles = extractBodyAngles(detectionResult);
      extractedBiomarkers = extractBiomarkers(detectionResult, extractedAngles);
      
      // Determine motion state
      newMotionState = determineMotionState(extractedAngles.kneeAngle);
    }
    
    return {
      result: detectionResult,
      angles: extractedAngles, 
      biomarkers: extractedBiomarkers,
      newMotionState
    };
  } catch (error) {
    console.error('Error in detection:', error);
    throw new Error('Detection failed');
  }
};

