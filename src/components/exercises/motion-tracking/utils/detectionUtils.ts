
import * as Human from '@vladmandic/human';
import { human } from '@/lib/human';
import { BodyAngles, MotionState } from '@/lib/human/types';
import { determineMotionState } from './motionStateUtils';

// Process a video frame and return detection results
export const performDetection = async (videoElement: HTMLVideoElement) => {
  try {
    // Run Human.js detection on video frame
    const result = await human.detect(videoElement);
    
    // Extract body angles from detection result
    const angles: BodyAngles = {
      kneeAngle: null,
      hipAngle: null,
      shoulderAngle: null,
      elbowAngle: null,
      ankleAngle: null,
      neckAngle: null
    };
    
    // Calculate angles if body detected
    if (result.body && result.body.length > 0) {
      const body = result.body[0];
      const keypoints = body.keypoints;
      
      // Get key body points
      const rightHip = keypoints.find(kp => kp.part === 'rightHip');
      const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
      const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
      const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
      const rightElbow = keypoints.find(kp => kp.part === 'rightElbow');
      const rightWrist = keypoints.find(kp => kp.part === 'rightWrist');
      
      // Calculate knee angle
      if (rightHip && rightKnee && rightAnkle && 
          rightHip.score > 0.5 && rightKnee.score > 0.5 && rightAnkle.score > 0.5) {
        // Use vector math to calculate angle
        const v1 = {
          x: rightHip.x - rightKnee.x,
          y: rightHip.y - rightKnee.y
        };
        
        const v2 = {
          x: rightAnkle.x - rightKnee.x,
          y: rightAnkle.y - rightKnee.y
        };
        
        // Calculate angle between vectors
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        if (mag1 > 0 && mag2 > 0) {
          const angleRad = Math.acos(Math.min(1, Math.max(-1, dot / (mag1 * mag2))));
          angles.kneeAngle = Math.round(angleRad * (180 / Math.PI));
        }
      }
      
      // Calculate hip angle
      if (rightKnee && rightHip && rightShoulder &&
          rightKnee.score > 0.5 && rightHip.score > 0.5 && rightShoulder.score > 0.5) {
        const v1 = {
          x: rightKnee.x - rightHip.x,
          y: rightKnee.y - rightHip.y
        };
        
        const v2 = {
          x: rightShoulder.x - rightHip.x,
          y: rightShoulder.y - rightHip.y
        };
        
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        if (mag1 > 0 && mag2 > 0) {
          const angleRad = Math.acos(Math.min(1, Math.max(-1, dot / (mag1 * mag2))));
          angles.hipAngle = Math.round(angleRad * (180 / Math.PI));
        }
      }
      
      // Calculate shoulder angle
      if (rightHip && rightShoulder && rightElbow &&
          rightHip.score > 0.5 && rightShoulder.score > 0.5 && rightElbow.score > 0.5) {
        const v1 = {
          x: rightHip.x - rightShoulder.x,
          y: rightHip.y - rightShoulder.y
        };
        
        const v2 = {
          x: rightElbow.x - rightShoulder.x,
          y: rightElbow.y - rightShoulder.y
        };
        
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        if (mag1 > 0 && mag2 > 0) {
          const angleRad = Math.acos(Math.min(1, Math.max(-1, dot / (mag1 * mag2))));
          angles.shoulderAngle = Math.round(angleRad * (180 / Math.PI));
        }
      }
    }
    
    // Extract biomarkers
    const biomarkers: Record<string, number | null> = {
      postureScore: null,
      movementQuality: null,
      rangeOfMotion: null,
      stabilityScore: null,
      symmetry: null,
      balance: null
    };
    
    // Calculate biomarkers based on detection data
    if (angles.kneeAngle !== null && angles.hipAngle !== null) {
      // Basic posture score - good posture would have a straight back (higher hip angle)
      biomarkers.postureScore = angles.hipAngle > 140 ? 80 : 
                               angles.hipAngle > 120 ? 60 : 40;
      
      // Range of motion - deeper squat (lower knee angle) indicates better ROM
      biomarkers.rangeOfMotion = angles.kneeAngle < 90 ? 90 :
                                angles.kneeAngle < 120 ? 70 : 50;
      
      // Stability - less movement in the upper body indicates better stability
      biomarkers.stabilityScore = angles.shoulderAngle && angles.shoulderAngle > 160 ? 85 : 60;
      
      // Overall movement quality - combination of the above
      biomarkers.movementQuality = ((biomarkers.postureScore || 0) + 
                                   (biomarkers.rangeOfMotion || 0) + 
                                   (biomarkers.stabilityScore || 0)) / 3;
    }
    
    // Determine motion state based on knee angle
    const newMotionState = determineMotionState(angles.kneeAngle);
    
    return {
      result,
      angles,
      biomarkers,
      newMotionState
    };
  } catch (error) {
    console.error('Error in performDetection:', error);
    throw error;
  }
};
