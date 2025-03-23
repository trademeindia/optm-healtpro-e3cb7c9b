
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyAngles } from '../posture-monitor/types';

interface BiomarkersDisplayProps {
  biomarkers: Record<string, any>;
  angles: BodyAngles;
}

const BiomarkersDisplay: React.FC<BiomarkersDisplayProps> = ({ biomarkers, angles }) => {
  const formatValue = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(1);
  };
  
  const getScoreColor = (score: number | null): string => {
    if (score === null || score === undefined) return 'text-gray-400';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Biomechanical Analysis</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="angles">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="angles">Joint Angles</TabsTrigger>
            <TabsTrigger value="biomarkers">Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="angles" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-medium mb-1">Knee Angle</h3>
                <div className="text-xl font-semibold">
                  {formatValue(angles.kneeAngle)}°
                </div>
                <p className="text-xs text-muted-foreground">Ideal: ~90° at bottom</p>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-medium mb-1">Hip Angle</h3>
                <div className="text-xl font-semibold">
                  {formatValue(angles.hipAngle)}°
                </div>
                <p className="text-xs text-muted-foreground">Tracks torso alignment</p>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-medium mb-1">Shoulder Angle</h3>
                <div className="text-xl font-semibold">
                  {formatValue(angles.shoulderAngle)}°
                </div>
                <p className="text-xs text-muted-foreground">Upper body position</p>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-medium mb-1">Neck Angle</h3>
                <div className="text-xl font-semibold">
                  {formatValue(angles.neckAngle)}°
                </div>
                <p className="text-xs text-muted-foreground">Head alignment</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="biomarkers">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-medium mb-1">Posture Score</h3>
                <div className={`text-xl font-semibold ${getScoreColor(biomarkers.postureScore)}`}>
                  {formatValue(biomarkers.postureScore || null)}
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${biomarkers.postureScore || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-medium mb-1">Balance</h3>
                <div className={`text-xl font-semibold ${getScoreColor(biomarkers.balanceScore)}`}>
                  {formatValue(biomarkers.balanceScore || null)}
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${biomarkers.balanceScore || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-medium mb-1">Symmetry</h3>
                <div className={`text-xl font-semibold ${getScoreColor(biomarkers.shoulderSymmetry)}`}>
                  {formatValue(biomarkers.shoulderSymmetry || null)}
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${biomarkers.shoulderSymmetry || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <h3 className="text-sm font-medium mb-1">Knee Stability</h3>
                <div className={`text-xl font-semibold ${getScoreColor(biomarkers.kneeStability)}`}>
                  {formatValue(biomarkers.kneeStability || null)}
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${biomarkers.kneeStability || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BiomarkersDisplay;
