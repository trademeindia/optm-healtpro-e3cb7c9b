
import * as Human from '@vladmandic/human';
import humanConfig from './config';

// Initialize Human
export const human = new Human.Human(humanConfig);

// Warm up the model
export const warmupModel = async () => {
  try {
    console.log('Warming up Human.js model...');
    // Initialize and warm up
    await human.load();
    // Perform a test detection on an empty canvas
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    await human.detect(canvas);
    console.log('Human.js model warmed up successfully');
    return true;
  } catch (error) {
    console.error('Error warming up Human.js model:', error);
    return false;
  }
};

// Reset the model
export const resetModel = () => {
  try {
    // For Human.js v3.x, proper cleanup
    if (typeof human.reset === 'function') {
      human.reset();
    }
    
    // Ensure tensor memory is released
    if (typeof human.tf?.dispose === 'function') {
      human.tf.dispose();
    }
    
    // For different versions that might have different cleanup methods
    if (typeof human.cleanup === 'function') {
      human.cleanup();
    }
    
    console.log('Human.js model reset successfully');
  } catch (error) {
    console.error('Error resetting Human.js model:', error);
  }
};

// Extract body angles from detection result
export const extractBodyAngles = (result: Human.Result) => {
  // Default values
  const angles = {
    kneeAngle: null as number | null,
    hipAngle: null as number | null,
    shoulderAngle: null as number | null,
    elbowAngle: null as number | null,
    ankleAngle: null as number | null,
    neckAngle: null as number | null
  };
  
  // Check if we have valid body keypoints
  if (!result.body || result.body.length === 0 || !result.body[0].keypoints) {
    return angles;
  }
  
  const keypoints = result.body[0].keypoints;
  
  // Extract keypoints for angle calculations
  // Implementation would go here...
  
  // Return the extracted angles
  return angles;
};

// Extract biomarkers from detection result and angles
export const extractBiomarkers = (result: Human.Result, angles: any) => {
  // Default biomarkers
  const biomarkers = {
    postureQuality: null as number | null,
    movementQuality: null as number | null,
    stabilityScore: null as number | null,
    symmetryScore: null as number | null,
    rangeOfMotion: null as number | null,
    movementSpeed: null as number | null
  };
  
  // Check if we have valid body detection
  if (!result.body || result.body.length === 0 || !result.body[0].keypoints) {
    return biomarkers;
  }
  
  // Extract biomarkers based on detection and angles
  // Implementation would go here...
  
  return biomarkers;
};

// Export Human instance and utilities
export default human;
