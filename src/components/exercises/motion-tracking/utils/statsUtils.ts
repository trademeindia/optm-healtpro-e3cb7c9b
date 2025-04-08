
import { MotionStats, BodyAngles } from '@/lib/human/types';

/**
 * Updates running averages for angles in the motion stats
 * @param stats Current motion stats
 * @param angles New body angles to incorporate
 * @param repCount Current rep count to weight the average
 * @returns Updated stats with new averages
 */
export const updateAngleAverages = (
  stats: MotionStats,
  angles: BodyAngles,
  repCount: number
): MotionStats => {
  const { kneeAngle, hipAngle } = angles;
  
  if (repCount === 0) {
    return {
      ...stats,
      averageKneeAngle: kneeAngle,
      averageHipAngle: hipAngle
    };
  }
  
  // Calculate running average
  const newAvgKnee = kneeAngle !== null && stats.averageKneeAngle !== null
    ? (stats.averageKneeAngle * repCount + kneeAngle) / (repCount + 1)
    : kneeAngle || stats.averageKneeAngle;
  
  const newAvgHip = hipAngle !== null && stats.averageHipAngle !== null
    ? (stats.averageHipAngle * repCount + hipAngle) / (repCount + 1)
    : hipAngle || stats.averageHipAngle;
  
  return {
    ...stats,
    averageKneeAngle: newAvgKnee,
    averageHipAngle: newAvgHip
  };
};

/**
 * Calculates biomarkers based on motion stats and current angles
 * @param stats Current motion stats
 * @param angles Current body angles
 * @returns Updated stats with biomarker values
 */
export const calculateBiomarkers = (
  stats: MotionStats,
  angles: BodyAngles,
  repDuration?: number
): MotionStats => {
  // This would normally be a complex calculation based on various factors
  // For demonstration, we'll use simplified calculations
  
  // Symmetry: how balanced the movement is (simplified)
  const symmetry = Math.min(100, Math.random() * 30 + 70); // 70-100 range for demo
  
  // Stability: how controlled the movement is
  const stability = repDuration 
    ? Math.min(100, 100 - Math.abs(repDuration - 2) * 10) // Ideal rep is ~2s
    : Math.min(100, Math.random() * 30 + 70);
  
  // Range of Motion: how complete the movement is
  const rangeOfMotion = angles.kneeAngle !== null
    ? Math.min(100, 100 - Math.abs(angles.kneeAngle - 100) * 0.5)
    : Math.min(100, Math.random() * 30 + 70);
  
  return {
    ...stats,
    symmetry,
    stability,
    rangeOfMotion
  };
};
