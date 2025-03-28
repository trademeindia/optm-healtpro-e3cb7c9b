
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DetectionStatus } from '@/lib/human/types';

interface PoseDetectionStatsProps {
  stats: {
    totalReps: number;
    goodReps: number;
    badReps: number;
    accuracy: number;
  };
  detectionStatus: DetectionStatus;
}

const PoseDetectionStats: React.FC<PoseDetectionStatsProps> = ({ stats, detectionStatus }) => {
  // Calculate confidence percentage
  const confidencePercent = Math.round((detectionStatus.confidence || 0) * 100);
  
  return (
    <Card className="bg-card">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Detection Confidence</span>
              <span className="font-medium">{confidencePercent}%</span>
            </div>
            <Progress 
              value={confidencePercent} 
              className="h-2"
              // Color based on confidence level
              style={{ 
                background: confidencePercent < 30 ? '#fecaca' : '#e5e7eb',
                "--progress-color": confidencePercent < 30 ? '#ef4444' : 
                                   confidencePercent < 70 ? '#f59e0b' : '#10b981'
              } as React.CSSProperties}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Form Accuracy</span>
              <span className="font-medium">{stats.accuracy.toFixed(0)}%</span>
            </div>
            <Progress 
              value={stats.accuracy} 
              className="h-2"
              style={{ 
                "--progress-color": stats.accuracy < 30 ? '#ef4444' : 
                                  stats.accuracy < 70 ? '#f59e0b' : '#10b981'
              } as React.CSSProperties}
            />
          </div>
          
          <div className="col-span-2 grid grid-cols-3 gap-2 mt-2 text-center text-sm">
            <div className="bg-muted rounded-md p-2">
              <div className="text-muted-foreground">FPS</div>
              <div className="font-semibold">{detectionStatus.fps || 0}</div>
            </div>
            <div className="bg-muted rounded-md p-2">
              <div className="text-muted-foreground">Keypoints</div>
              <div className="font-semibold">{detectionStatus.detectedKeypoints}</div>
            </div>
            <div className="bg-muted rounded-md p-2">
              <div className="text-muted-foreground">Total Reps</div>
              <div className="font-semibold">{stats.totalReps}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoseDetectionStats;
