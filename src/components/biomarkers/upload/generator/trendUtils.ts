
import { BiomarkerStatus } from './types';

/**
 * Determines trend based on biomarker status
 */
export const determineTrend = (status: BiomarkerStatus): 'up' | 'down' | 'stable' => {
  if (status === 'normal') {
    // Normal values are more likely to be stable
    const random = Math.random();
    if (random < 0.7) return 'stable';
    return random < 0.85 ? 'up' : 'down';
  } else if (status === 'elevated') {
    // Elevated values are more likely to show an upward trend
    return Math.random() < 0.7 ? 'up' : 'stable';
  } else if (status === 'low') {
    // Low values are more likely to show a downward trend
    return Math.random() < 0.7 ? 'down' : 'stable';
  } else if (status === 'critical') {
    // Critical values have different patterns
    return Math.random() < 0.5 ? 'up' : 'down';
  }
  
  return 'stable';
};
