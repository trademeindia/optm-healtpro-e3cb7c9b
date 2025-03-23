
import React from 'react';
import MotionTracker from '@/components/exercises/motion-tracking';
import '@/styles/responsive/motion-tracker.css';

export default function MotionAnalysisPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      <div className="space-y-3 bg-background/50 p-5 rounded-lg border shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Motion Analysis</h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
          This exercise uses AI to track your movements and provide real-time feedback on your form.
          Position yourself in front of the camera so your full body is visible.
        </p>
      </div>
      
      <div className="motion-tracker-container w-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-5 shadow-md">
        <MotionTracker
          exerciseId="basic-squat"
          exerciseName="Basic Squat Technique"
        />
      </div>
    </div>
  );
}
