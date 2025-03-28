
import { useState, useEffect, useCallback } from 'react';
import { BodyAngles, MotionState } from '@/lib/human/types';

export const useMotionAnalysis = (angles: BodyAngles) => {
  const [motionState, setMotionState] = useState<MotionState>(MotionState.STANDING);
  const [lastChangeTime, setLastChangeTime] = useState<number>(Date.now());
  
  // Initialize with valid empty angles
  const [previousAngles, setPreviousAngles] = useState<BodyAngles>({
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  });
  
  const [angleVelocity, setAngleVelocity] = useState({
    knee: 0,
    hip: 0,
    shoulder: 0
  });
  
  // Calculate angle velocity (rate of change)
  useEffect(() => {
    const now = Date.now();
    const timeDelta = (now - lastChangeTime) / 1000; // convert to seconds
    
    if (timeDelta > 0) {
      const kneeVelocity = calculateVelocity(angles.kneeAngle, previousAngles.kneeAngle, timeDelta);
      const hipVelocity = calculateVelocity(angles.hipAngle, previousAngles.hipAngle, timeDelta);
      const shoulderVelocity = calculateVelocity(angles.shoulderAngle, previousAngles.shoulderAngle, timeDelta);
      
      setAngleVelocity({
        knee: kneeVelocity,
        hip: hipVelocity,
        shoulder: shoulderVelocity
      });
      
      setPreviousAngles(angles);
      setLastChangeTime(now);
    }
  }, [angles, previousAngles, lastChangeTime]);
  
  // Determine motion state based on angles and velocities
  useEffect(() => {
    const { kneeAngle } = angles;
    const { knee: kneeVelocity } = angleVelocity;
    
    // Simple motion state detection based on knee angle and velocity
    if (kneeAngle === null) {
      return;
    }
    
    // Determine motion state based on knee angle and velocity
    if (kneeAngle > 160) {
      setMotionState(MotionState.STANDING);
    } else if (kneeAngle < 100) {
      setMotionState(MotionState.FULL_MOTION);
    } else {
      setMotionState(MotionState.MID_MOTION);
    }
    
  }, [angles, angleVelocity]);
  
  // Helper function to calculate velocity
  const calculateVelocity = (currentAngle: number | null, previousAngle: number | null, timeDelta: number): number => {
    if (currentAngle === null || previousAngle === null) {
      return 0;
    }
    
    return (currentAngle - previousAngle) / timeDelta;
  };
  
  // Determine if a full motion (rep) has been completed
  const checkForCompletedRep = useCallback((): boolean => {
    // Simple implementation: a rep is completed when motion state returns to STANDING
    // after being in FULL_MOTION
    return motionState === MotionState.STANDING;
  }, [motionState]);
  
  // Evaluate form quality
  const evaluateFormQuality = useCallback((): {isGoodForm: boolean; feedback: string} => {
    // Simple form evaluation based on hip and knee angles
    const { kneeAngle, hipAngle } = angles;
    
    if (kneeAngle === null || hipAngle === null) {
      return { isGoodForm: false, feedback: "Cannot evaluate form - incomplete detection" };
    }
    
    // Check for common form issues
    const kneeInRange = kneeAngle >= 80 && kneeAngle <= 100;
    const hipInRange = hipAngle >= 70 && hipAngle <= 110;
    
    if (!kneeInRange) {
      return { 
        isGoodForm: false, 
        feedback: kneeAngle < 80 
          ? "Knee angle too small - you're going too deep" 
          : "Not bending knees enough" 
      };
    }
    
    if (!hipInRange) {
      return { 
        isGoodForm: false, 
        feedback: hipAngle < 70 
          ? "Hip angle too small - watch your back posture" 
          : "Not hinging enough at the hips"
      };
    }
    
    return { isGoodForm: true, feedback: "Great form! Keep it up" };
  }, [angles]);
  
  return {
    motionState,
    angleVelocity,
    checkForCompletedRep,
    evaluateFormQuality
  };
};
