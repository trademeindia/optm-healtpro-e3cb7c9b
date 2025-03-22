
# Motion Tracker Component

An AI-powered motion tracking system that uses computer vision to analyze human movements, provide real-time feedback, and track exercise repetitions.

## Overview

The Motion Tracker component leverages the Human.js library to perform real-time pose estimation directly in the browser. All processing happens locally on the user's device with no data sent to external servers, ensuring privacy while providing high-quality motion analysis.

## Technical Architecture

The component is built with a modular architecture consisting of the following key parts:

### Core Components

1. **MotionTracker**: The main component that orchestrates the motion tracking experience.
2. **CameraView**: Handles rendering the camera feed and pose detection overlay.
3. **FeedbackDisplay**: Shows real-time feedback to the user based on movement analysis.
4. **StatsDisplay**: Visualizes exercise repetitions and form accuracy.
5. **TutorialDialog**: Provides instructions for using the motion tracker.
6. **PoseRenderer**: (Utility component) For rendering pose data.

### Custom Hooks

The motion tracker uses three specialized hooks that separate concerns:

1. **useCamera.ts**: Manages camera access, permissions, and video streaming.
   - Handles starting and stopping the camera
   - Manages device permissions
   - Controls video element lifecycle

2. **useHumanDetection.ts**: Initializes and runs the Human.js pose detection.
   - Loads and configures the Human.js model
   - Processes video frames and detects human pose
   - Provides detection results and statistics

3. **useMotionAnalysis.ts**: Analyzes detected poses to recognize exercises.
   - Processes raw pose data to extract meaningful movements
   - Counts exercise repetitions
   - Evaluates form quality
   - Generates feedback for the user

### Data Flow

1. Camera captures video frames
2. Human.js processes frames to detect body keypoints
3. Motion analysis interprets keypoints as exercise movements
4. UI components display feedback and stats based on the analysis

## How It Works

1. The user starts the camera by clicking the start button
2. The Human.js library initializes and begins analyzing video frames
3. Detected body keypoints are rendered as an overlay on the video
4. The motion analysis system evaluates the movements:
   - Identifies exercise repetitions
   - Analyzes form and posture
   - Provides real-time feedback
5. Statistics are updated as the user performs exercises

## How to Extend with New Exercise Types

The motion tracker can be extended to support additional exercise types by modifying the `useMotionAnalysis.ts` hook:

### Steps to Add a New Exercise Type

1. **Define Detection Logic**: In `useMotionAnalysis.ts`, add new logic to detect the specific movement patterns of the exercise.

Example:
```typescript
// Example for adding a push-up detector
const detectPushUp = (keypoints) => {
  const wrists = getWristPosition(keypoints);
  const shoulders = getShoulderPosition(keypoints);
  const elbows = getElbowPosition(keypoints);
  
  // Calculate the angle between arms and torso
  const armAngle = calculateAngle(wrists, elbows, shoulders);
  
  // Detect push-up states based on arm angle
  if (armAngle < 70) return "push-up-down";
  if (armAngle > 160) return "push-up-up";
  return "push-up-transition";
};
```

2. **Update Analysis Function**: Extend the `analyzeMovement` function to incorporate the new exercise detection.

```typescript
// In analyzeMovement function
if (exerciseType === 'push-up') {
  const pushUpState = detectPushUp(keypoints);
  
  if (pushUpState === "push-up-up" && prevState === "push-up-down") {
    // Count a repetition
    setStats(prev => ({
      ...prev,
      repetitions: prev.repetitions + 1,
      accuracy: calculateAccuracy(keypoints, 'push-up'),
      feedback: "push-up-up"
    }));
    
    onFeedbackChange(`Great job! Push-up ${stats.repetitions + 1} completed.`, FeedbackType.SUCCESS);
  }
  // Additional state logic...
}
```

3. **Add Form Analysis**: Implement form evaluation specific to the new exercise.

```typescript
const evaluatePushUpForm = (keypoints) => {
  // Check back alignment
  const backAlignment = checkBackAlignment(keypoints);
  if (!backAlignment) {
    return "Keep your back straight during push-ups";
  }
  
  // Check elbow position
  const elbowPosition = checkElbowPosition(keypoints);
  if (!elbowPosition) {
    return "Keep elbows closer to your body";
  }
  
  return null; // Good form
};
```

4. **Connect to UI**: Update the MotionTracker component to pass the appropriate exercise type to the hooks.

## Configuration Options

The motion tracker can be configured through props passed to the MotionTracker component:

- `exerciseId`: Unique identifier for the selected exercise
- `exerciseName`: Display name of the exercise
- `onFinish`: Callback function executed when the exercise session is completed

## Future Improvements

- Support for more complex exercise movements
- Customizable form evaluation thresholds
- Downloadable exercise session reports
- Multi-person tracking for group exercises
- Integration with existing fitness tracking platforms

## Technical Notes

- The Human.js model runs entirely client-side, ensuring privacy
- Performance may vary depending on the user's device capabilities
- Optimal lighting conditions improve detection accuracy
- Requires camera permissions and works best with unobstructed full-body view

## Dependencies

- @vladmandic/human: AI-powered computer vision library for detecting human pose
- React/TypeScript: For component architecture and type safety
- Tailwind CSS & shadcn/ui: For responsive UI design
