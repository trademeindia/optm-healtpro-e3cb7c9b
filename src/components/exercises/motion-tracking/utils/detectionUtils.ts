
import * as Human from '@vladmandic/human';
import { DetectionResult } from '../hooks/types';
import { human, warmupModel, resetModel } from '@/lib/human';
import { extractBodyAngles } from '@/lib/human/angles';
import { MotionState } from '@/components/exercises/posture-monitor/types';
import { determineMotionState } from './motionStateUtils';

// Default empty angles object for when detection fails
const emptyAngles = {
  kneeAngle: null,
  hipAngle: null,
  shoulderAngle: null,
  elbowAngle: null,
  ankleAngle: null,
  neckAngle: null
};

// Track detection performance metrics for adaptive frame skipping
let consecutiveFailures = 0;
let lastSuccessfulDetection = 0;
let tensorCleanupCounter = 0;
const MAX_CONSECUTIVE_FAILURES = 10;
const TENSOR_CLEANUP_THRESHOLD = 150; // Reduced threshold for earlier cleanup
const TENSOR_CLEANUP_INTERVAL = 5; // Clean up every 5 detections

// Tracking performance metrics
let totalDetectionAttempts = 0;
let successfulDetections = 0;

/**
 * Check if video element is ready for detection
 */
const isVideoElementReady = (videoElement: HTMLVideoElement): boolean => {
  if (!videoElement) return false;
  
  // Check for video readiness
  const isReady = videoElement.readyState >= 2 && 
                  !videoElement.paused && 
                  videoElement.videoWidth > 0 && 
                  videoElement.videoHeight > 0;
  
  if (!isReady) {
    console.warn('Video not ready for detection:', {
      readyState: videoElement.readyState,
      paused: videoElement.paused,
      width: videoElement.videoWidth,
      height: videoElement.videoHeight
    });
  }
  
  return isReady;
};

/**
 * Proactively clean up tensors to prevent memory issues
 */
const cleanupTensors = (force = false): void => {
  if (!human.tf) return;
  
  tensorCleanupCounter++;
  
  const numTensors = human.tf.engine().state.numTensors;
  
  // Clean up if tensor count is above threshold or forced
  if (numTensors > TENSOR_CLEANUP_THRESHOLD || 
      (tensorCleanupCounter >= TENSOR_CLEANUP_INTERVAL) || 
      force) {
    
    console.log(`Cleaning up tensors (count: ${numTensors})`);
    human.tf.engine().disposeVariables();
    tensorCleanupCounter = 0;
    
    // Log result of cleanup
    console.log(`Tensors after cleanup: ${human.tf.engine().state.numTensors}`);
  }
};

/**
 * Reset model if too many consecutive failures
 */
const handleConsecutiveFailures = async (): Promise<boolean> => {
  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    console.warn(`Too many consecutive detection failures (${consecutiveFailures}), resetting model`);
    consecutiveFailures = 0;
    
    // Force tensor cleanup
    cleanupTensors(true);
    
    // Reset and reload model
    await resetModel();
    return await warmupModel();
  }
  return true;
};

/**
 * Calculate adaptive timeout based on past performance
 */
const getAdaptiveTimeout = (): number => {
  // Lower timeout when there are failures to fail faster
  if (consecutiveFailures > 0) {
    return Math.max(1000, 3000 - (consecutiveFailures * 200));
  }
  
  // Standard timeout
  return 3000;
};

/**
 * Extract biomarkers from detection result and angles
 */
const extractBiomarkers = (result: Human.Result | null, angles: any): Record<string, any> => {
  if (!result || !result.body || result.body.length === 0) {
    return {};
  }
  
  const biomarkers: Record<string, any> = {};
  
  try {
    const body = result.body[0];
    
    // Calculate balance score based on keypoint positions
    if (body.keypoints) {
      // Get relevant keypoints
      const nose = body.keypoints.find(kp => kp.part === 'nose');
      const leftAnkle = body.keypoints.find(kp => kp.part === 'leftAnkle');
      const rightAnkle = body.keypoints.find(kp => kp.part === 'rightAnkle');
      
      if (nose && leftAnkle && rightAnkle) {
        // Vertical alignment (lower is better)
        const centerX = (leftAnkle.x + rightAnkle.x) / 2;
        const verticalAlignment = Math.abs(nose.x - centerX);
        
        // Scale to a 0-100 score, where 100 is perfect alignment
        const alignmentScore = Math.max(0, 100 - (verticalAlignment / 5));
        biomarkers.balanceScore = Math.round(alignmentScore);
      }
    }
    
    // Add joint health indicators based on angles
    if (angles.kneeAngle !== null) {
      // Check if knee angle is in healthy range (avoiding hyperextension or excessive flexion)
      const kneeAngle = angles.kneeAngle;
      const kneeHealthy = kneeAngle > 80 && kneeAngle < 175;
      biomarkers.kneeHealthy = kneeHealthy;
    }
    
    if (angles.hipAngle !== null) {
      // Check if hip angle is in healthy range
      const hipAngle = angles.hipAngle;
      const hipHealthy = hipAngle > 70 && hipAngle < 180;
      biomarkers.hipHealthy = hipHealthy;
    }
    
    // Calculate symmetry if both sides are detected
    // This would require enhancements to extractBodyAngles to return both left and right angles
    
    // Add overall posture score based on angles
    if (angles.kneeAngle !== null && angles.hipAngle !== null && angles.shoulderAngle !== null) {
      const kneeScore = angles.kneeAngle > 80 && angles.kneeAngle < 175 ? 100 : 50;
      const hipScore = angles.hipAngle > 70 && angles.hipAngle < 180 ? 100 : 50;
      const shoulderScore = angles.shoulderAngle > 70 && angles.shoulderAngle < 180 ? 100 : 50;
      
      biomarkers.postureScore = Math.round((kneeScore + hipScore + shoulderScore) / 3);
    }
    
    return biomarkers;
  } catch (error) {
    console.error('Error extracting biomarkers:', error);
    return {};
  }
};

/**
 * Performs pose detection on a video frame and returns processed results
 * with improved error handling and adaptive frame skipping
 */
export const performDetection = async (
  videoElement: HTMLVideoElement
): Promise<DetectionResult> => {
  // Track attempts for analytics
  totalDetectionAttempts++;
  
  // Check if video is ready for detection
  if (!isVideoElementReady(videoElement)) {
    consecutiveFailures++;
    await handleConsecutiveFailures();
    
    return {
      result: null,
      angles: emptyAngles,
      biomarkers: {},
      newMotionState: null
    };
  }

  try {
    // Check if model is loaded first
    if (!human.models.loaded()) {
      console.warn('Human model not loaded, attempting to load now');
      try {
        const loaded = await warmupModel();
        if (!loaded) {
          console.warn('Failed to load Human model completely');
          consecutiveFailures++;
          return {
            result: null,
            angles: emptyAngles,
            biomarkers: {},
            newMotionState: null
          };
        } else {
          console.log('Human model loaded successfully');
        }
      } catch (e) {
        console.error('Failed to load Human model:', e);
        consecutiveFailures++;
        return {
          result: null,
          angles: emptyAngles,
          biomarkers: {},
          newMotionState: null
        };
      }
    }
    
    // Use adaptive frame skipping based on performance
    if (consecutiveFailures === 0 && (Date.now() - lastSuccessfulDetection) < 100) {
      // Skip this frame if we've had recent successful detections
      return {
        result: null,
        angles: emptyAngles,
        biomarkers: {},
        newMotionState: null
      };
    }
    
    // Log current configuration
    console.log("Current Human.js config:", {
      modelPath: human.config.body.modelPath,
      backend: human.config.backend,
      warmup: human.config.warmup
    });
    
    // Use adaptive timeout based on past performance
    const timeoutDuration = getAdaptiveTimeout();
    
    // Run detection with appropriate timeout
    const detectionPromise = human.detect(videoElement, {
      body: { enabled: true },
      face: { enabled: false },
      hand: { enabled: false },
      object: { enabled: false },
      gesture: { enabled: false },
      segmentation: { enabled: false }
    });
    
    console.log(`Starting detection with ${timeoutDuration}ms timeout`);
    if (human.tf) {
      console.log(`Current tensor count: ${human.tf.engine().state.numTensors}`);
    }
    
    // Race the detection against the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), timeoutDuration);
    });
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;

    // Clean up tensors periodically or when tensor count is high
    cleanupTensors();

    // Reset failure tracking on successful API call
    consecutiveFailures = 0;
    lastSuccessfulDetection = Date.now();
    successfulDetections++;

    if (!result || !result.body || result.body.length === 0) {
      console.log('No body detected in frame');
      return {
        result: null,
        angles: emptyAngles,
        biomarkers: {},
        newMotionState: null
      };
    }

    // Log successful detection
    console.log(`Body detected: ${result.body.length} bodies, ${result.body[0].keypoints.length} keypoints`);

    // Calculate joint angles
    const angles = extractBodyAngles(result);
    
    // Calculate biomarkers based on detection and angles
    const biomarkers = extractBiomarkers(result, angles);

    // Log the calculated angles for debugging
    console.log('Calculated angles:', 
      JSON.stringify({
        knee: angles.kneeAngle, 
        hip: angles.hipAngle, 
        shoulder: angles.shoulderAngle
      })
    );

    // Determine motion state based on angles and the current state
    const newMotionState = determineMotionState(angles, MotionState.STANDING);

    // Log detection success rate
    if (totalDetectionAttempts % 20 === 0) {
      const successRate = (successfulDetections / totalDetectionAttempts) * 100;
      console.log(`Detection success rate: ${successRate.toFixed(1)}% (${successfulDetections}/${totalDetectionAttempts})`);
    }

    return {
      result,
      angles,
      biomarkers,
      newMotionState
    };
  } catch (error) {
    console.error('Error in detection:', error);
    
    // Track consecutive failures for adaptive performance
    consecutiveFailures++;
    
    // Check if we need to reset model due to too many failures
    await handleConsecutiveFailures();
    
    // Handle the specific segmentation error
    if (error instanceof Error && 
        error.message.includes('activation_segmentation') || 
        error.message.includes('not found in the graph')) {
      console.warn('Encountered segmentation error, disabling segmentation');
      
      // Explicitly disable segmentation in case it got enabled somehow
      if (human.config.segmentation) {
        human.config.segmentation.enabled = false;
      }
      
      // Force reset model to apply config changes
      await resetModel();
      await warmupModel();
    }
    
    // Clean up any lingering tensors to prevent memory leaks
    cleanupTensors(true);
    
    // Return a valid result even on error to prevent crashes
    return {
      result: null,
      angles: emptyAngles,
      biomarkers: {},
      newMotionState: null
    };
  }
};

/**
 * Public API to get detection statistics
 */
export const getDetectionStats = () => {
  return {
    totalAttempts: totalDetectionAttempts,
    successfulDetections,
    successRate: totalDetectionAttempts > 0 
      ? (successfulDetections / totalDetectionAttempts) * 100 
      : 0,
    consecutiveFailures
  };
};

/**
 * Reset detection statistics
 */
export const resetDetectionStats = () => {
  totalDetectionAttempts = 0;
  successfulDetections = 0;
  consecutiveFailures = 0;
  lastSuccessfulDetection = 0;
  tensorCleanupCounter = 0;
};
