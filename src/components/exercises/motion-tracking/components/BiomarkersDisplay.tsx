
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivitySquare, ArrowUpDown, Shield, Zap } from 'lucide-react';

interface BiomarkersDisplayProps {
  biomarkers: {
    postureScore: number;
    movementQuality: number;
    rangeOfMotion: number;
    stabilityScore: number;
  };
}

const BiomarkersDisplay: React.FC<BiomarkersDisplayProps> = ({ biomarkers }) => {
  // Helper function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Biomarkers</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="biomarker-grid">
          <div className="biomarker-card">
            <div className="flex items-center gap-2">
              <ActivitySquare className="h-4 w-4 text-blue-500" />
              <p className="biomarker-header">Posture</p>
            </div>
            <p className={`biomarker-value ${getScoreColor(biomarkers.postureScore)}`}>
              {biomarkers.postureScore}%
            </p>
          </div>
          
          <div className="biomarker-card">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <p className="biomarker-header">Movement Quality</p>
            </div>
            <p className={`biomarker-value ${getScoreColor(biomarkers.movementQuality)}`}>
              {biomarkers.movementQuality}%
            </p>
          </div>
          
          <div className="biomarker-card">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-green-500" />
              <p className="biomarker-header">Range of Motion</p>
            </div>
            <p className={`biomarker-value ${getScoreColor(biomarkers.rangeOfMotion)}`}>
              {biomarkers.rangeOfMotion}%
            </p>
          </div>
          
          <div className="biomarker-card">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              <p className="biomarker-header">Stability</p>
            </div>
            <p className={`biomarker-value ${getScoreColor(biomarkers.stabilityScore)}`}>
              {biomarkers.stabilityScore}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkersDisplay;
