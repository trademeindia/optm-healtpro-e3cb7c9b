
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import PostureAnalysisTabs from './posture-analysis/PostureAnalysisTabs';
import RecommendedExercises from './posture-analysis/RecommendedExercises';

interface PostureAnalysisProps {
  className?: string;
}

const PostureAnalysis: React.FC<PostureAnalysisProps> = ({
  className
}) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posture');
  
  // Mock data for progress snapshots
  const progressSnapshots = [
    { id: 1, date: 'May 15, 2023', posture: 'Initial Assessment', improvement: '0%' },
    { id: 2, date: 'Jun 20, 2023', posture: 'First Follow-up', improvement: '12%' },
    { id: 3, date: 'Jul 25, 2023', posture: 'Second Follow-up', improvement: '27%' }
  ];

  // Mock posture analysis data
  const postureAnalysis = {
    overallScore: 68,
    areas: [
      { name: 'Head Alignment', score: 75, status: 'good', recommendation: 'Maintain current posture' },
      { name: 'Shoulder Balance', score: 62, status: 'moderate', recommendation: 'Try shoulder rolls and stretches' },
      { name: 'Spine Curvature', score: 58, status: 'moderate', recommendation: 'Focus on core strengthening' },
      { name: 'Hip Alignment', score: 77, status: 'good', recommendation: 'Continue hip-opening exercises' }
    ]
  };
  
  return (
    <div className={cn("glass-morphism rounded-2xl p-4 md:p-6", className)}>
      <h3 className="text-lg font-semibold mb-2">Posture & Mobility Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Track posture metrics, range-of-motion, and view progress over time
      </p>
      
      <PostureAnalysisTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        postureAnalysis={postureAnalysis}
        progressSnapshots={progressSnapshots}
      />
      
      <RecommendedExercises />
    </div>
  );
};

export default PostureAnalysis;
