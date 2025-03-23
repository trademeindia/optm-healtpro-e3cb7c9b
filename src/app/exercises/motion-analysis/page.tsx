
import React from 'react';
import MotionTracker from '@/components/exercises/motion-tracking';
import '@/styles/responsive/motion-tracker.css';

export default function MotionAnalysisPage() {
  return (
    <div className="container mx-auto py-4 sm:py-6 px-4 max-w-7xl">
      <div className="space-y-3 bg-background/50 rounded-lg border-border/60 shadow-sm border p-4 sm:p-5 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Motion Analysis</h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-3xl">
          This exercise uses AI to track your movements and provide real-time feedback on your form.
          Position yourself in front of the camera so your full body is visible.
        </p>
      </div>
      
      <div className="motion-tracker-container w-full rounded-xl overflow-hidden bg-card p-3 sm:p-5 shadow-md border border-border/60">
        <MotionTracker
          exerciseId="basic-squat"
          exerciseName="Basic Squat Technique"
        />
      </div>
    </div>
  );
}
