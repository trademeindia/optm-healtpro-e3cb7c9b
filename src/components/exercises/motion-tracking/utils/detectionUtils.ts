
import * as Human from '@vladmandic/human';
import { human } from '@/lib/human';
import { MotionState, BodyAngles } from '@/lib/human/types';

// Perform detection on video and extract relevant data
export const performDetection = async (video: HTMLVideoElement) => {
  try {
    // Run human detection on the video frame
    const detectionResult = await human.detect(video);
    
    // Extract body angles
    const extractedAngles = extractAngles(detectionResult);
    
    // Extract biomarkers from detection result
    const extractedBiomarkers = extractBiomarkers(detectionResult);
    
    // Determine motion state based on knee angle
    const kneeAngle = extractedAngles.kneeAngle || 180;
    let newMotionState = determineMotionState(kneeAngle);
    
    return {
      result: detectionResult,
      angles: extractedAngles,
      biomarkers: extractedBiomarkers,
      newMotionState
    };
  } catch (error) {
    console.error('Error during pose detection:', error);
    // Return dummy data for error case
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
};

// Extract angles from detection result
const extractAngles = (result: Human.Result | null): BodyAngles => {
  if (!result || !result.body || result.body.length === 0) {
    return {
      kneeAngle: null,
      hipAngle: null,
      shoulderAngle: null,
      elbowAngle: null,
      ankleAngle: null,
      neckAngle: null
    };
  }
  
  // For demo purposes, we're simulating angle calculation
  // Real implementation would calculate these based on actual keypoints
  const kneeAngle = calculateSimulatedAngle(result.body[0], 'knee');
  const hipAngle = calculateSimulatedAngle(result.body[0], 'hip');
  const shoulderAngle = calculateSimulatedAngle(result.body[0], 'shoulder');
  const elbowAngle = calculateSimulatedAngle(result.body[0], 'elbow');
  const ankleAngle = calculateSimulatedAngle(result.body[0], 'ankle');
  const neckAngle = calculateSimulatedAngle(result.body[0], 'neck');
  
  return {
    kneeAngle,
    hipAngle,
    shoulderAngle,
    elbowAngle,
    ankleAngle,
    neckAngle
  };
};

// Calculate a simulated angle for demo purposes
const calculateSimulatedAngle = (body: Human.BodyResult, jointType: string): number => {
  // For demo - you'd normally compute these from relative positions of keypoints
  const confidence = body.score || 0.5;
  
  switch (jointType) {
    case 'knee':
      // Simulate knee bending as the person squats
      return 170 - (Math.random() * 70) * confidence;
    case 'hip':
      // Simulate hip angle changes
      return 160 - (Math.random() * 50) * confidence;
    case 'shoulder':
      // Shoulders stay relatively stable
      return 170 + (Math.random() * 20 - 10) * confidence;
    case 'elbow':
      // Elbow angle varies slightly
      return 160 + (Math.random() * 30 - 15) * confidence;
    case 'ankle':
      // Ankle adjusts slightly
      return 85 + (Math.random() * 10) * confidence;
    case 'neck':
      // Neck stays relatively upright
      return 150 + (Math.random() * 20) * confidence;
    default:
      return 180;
  }
};

// Extract biomarkers from detection result
const extractBiomarkers = (result: Human.Result | null): Record<string, any> => {
  if (!result || !result.body || result.body.length === 0) {
    return {};
  }
  
  // For demo purposes - real implementation would extract actual biomechanical data
  const confidence = result.body[0].score || 0.5;
  
  return {
    balance: 0.7 + (Math.random() * 0.3) * confidence,
    stability: 0.8 + (Math.random() * 0.2) * confidence,
    symmetry: 0.75 + (Math.random() * 0.25) * confidence,
    posture: 0.6 + (Math.random() * 0.4) * confidence,
    range: 0.5 + (Math.random() * 0.5) * confidence
  };
};

// Determine motion state based on knee angle
const determineMotionState = (kneeAngle: number): MotionState => {
  if (kneeAngle < 130) {
    return MotionState.FULL_MOTION;
  } else if (kneeAngle < 160) {
    return MotionState.MID_MOTION;
  } else {
    return MotionState.STANDING;
  }
};
