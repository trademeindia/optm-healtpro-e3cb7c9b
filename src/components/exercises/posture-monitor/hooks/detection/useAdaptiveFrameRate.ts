import { useCallback, useRef } from 'react';

export const useAdaptiveFrameRate = () => {
  // Config parameters for adaptive frame rate
  const fpsTarget = useRef({
    min: 15,    // Minimum acceptable FPS
    target: 24, // Target FPS for good experience
    max: 30     // Maximum FPS to limit resource usage
  });
  
  // Track performance to make informed decisions
  const performanceRef = useRef({
    avgDetectionTime: 33, // Initial guess (30fps)
    lastAdaptationTime: 0,
    consecSlowFrames: 0,
    consecFastFrames: 0
  });
  
  // Calculate adaptive frame delay based on performance
  const calculateFrameDelay = useCallback((lastDetectionTime: number) => {
    const now = performance.now();
    const detectionTime = now - lastDetectionTime;
    
    // Skip if no valid last detection time
    if (lastDetectionTime === 0) return 0;
    
    // Update running average (weighted)
    performanceRef.current.avgDetectionTime = 
      performanceRef.current.avgDetectionTime * 0.9 + detectionTime * 0.1;
    
    // Adaptive delay calculation based on performance
    let delay = 0;
    
    // If detection is very fast, add delay to limit to max FPS
    if (detectionTime < 1000 / fpsTarget.current.max) {
      delay = (1000 / fpsTarget.current.max) - detectionTime;
      performanceRef.current.consecFastFrames++;
      performanceRef.current.consecSlowFrames = 0;
    } 
    // If detection is slow, reduce delay to maintain minimum frame rate
    else if (detectionTime > 1000 / fpsTarget.current.min) {
      delay = 0; // No delay, run as fast as possible
      performanceRef.current.consecSlowFrames++;
      performanceRef.current.consecFastFrames = 0;
    }
    // Otherwise aim for the target frame rate
    else {
      delay = Math.max(0, (1000 / fpsTarget.current.target) - detectionTime);
      performanceRef.current.consecSlowFrames = 0;
      performanceRef.current.consecFastFrames = 0;
    }
    
    // Adjust target values based on sustained performance
    if (now - performanceRef.current.lastAdaptationTime > 5000) {
      if (performanceRef.current.consecSlowFrames > 10) {
        // Consistently slow, lower the targets
        fpsTarget.current.target = Math.max(fpsTarget.current.min, fpsTarget.current.target - 2);
        console.log(`Adapting to slower device: target FPS lowered to ${fpsTarget.current.target}`);
      } else if (performanceRef.current.consecFastFrames > 30) {
        // Consistently fast, can try higher targets up to max
        fpsTarget.current.target = Math.min(fpsTarget.current.max, fpsTarget.current.target + 1);
        console.log(`Adapting to faster device: target FPS raised to ${fpsTarget.current.target}`);
      }
      
      performanceRef.current.lastAdaptationTime = now;
      performanceRef.current.consecSlowFrames = 0;
      performanceRef.current.consecFastFrames = 0;
    }
    
    return delay;
  }, []);

  // Initial delay to ensure video element is ready
  const getInitialDelay = useCallback(() => {
    return 500; // 500ms initial delay to ensure video is loaded
  }, []);

  return { calculateFrameDelay, getInitialDelay };
};
