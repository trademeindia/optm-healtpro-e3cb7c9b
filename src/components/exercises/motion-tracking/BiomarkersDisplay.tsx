
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyAngles } from '../posture-monitor/types';
import { Activity } from 'lucide-react';

interface BiomarkersDisplayProps {
  biomarkers: Record<string, any>;
  angles: BodyAngles;
}

const BiomarkersDisplay: React.FC<BiomarkersDisplayProps> = ({ biomarkers, angles }) => {
  const hasAngles = angles && (
    angles.kneeAngle !== null ||
    angles.hipAngle !== null ||
    angles.shoulderAngle !== null ||
    angles.elbowAngle !== null ||
    angles.ankleAngle !== null ||
    angles.neckAngle !== null
  );
  
  // Check if we have any meaningful biomarker data
  const hasBiomarkers = biomarkers && Object.keys(biomarkers).length > 0;
  
  if (!hasAngles && !hasBiomarkers) return null;
  
  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>Movement Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="angles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="angles">Joint Angles</TabsTrigger>
            <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="angles">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {angles.kneeAngle !== null && (
                <AngularMetric 
                  name="Knee Angle" 
                  value={angles.kneeAngle} 
                  optimal={90}
                  range={[70, 110]}
                />
              )}
              
              {angles.hipAngle !== null && (
                <AngularMetric 
                  name="Hip Angle" 
                  value={angles.hipAngle} 
                  optimal={130}
                  range={[110, 150]}
                />
              )}
              
              {angles.shoulderAngle !== null && (
                <AngularMetric 
                  name="Shoulder Angle" 
                  value={angles.shoulderAngle} 
                  optimal={90}
                  range={[80, 100]}
                />
              )}
              
              {angles.elbowAngle !== null && (
                <AngularMetric 
                  name="Elbow Angle" 
                  value={angles.elbowAngle} 
                  optimal={90}
                  range={[70, 110]}
                />
              )}
              
              {angles.ankleAngle !== null && (
                <AngularMetric 
                  name="Ankle Angle" 
                  value={angles.ankleAngle} 
                  optimal={110}
                  range={[100, 120]}
                />
              )}
              
              {angles.neckAngle !== null && (
                <AngularMetric 
                  name="Neck Angle" 
                  value={angles.neckAngle} 
                  optimal={170}
                  range={[160, 180]}
                />
              )}
              
              {!hasAngles && (
                <div className="col-span-3 text-center py-4 text-muted-foreground">
                  Joint angle data not available
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="biomarkers">
            {hasBiomarkers ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(biomarkers).map(([key, value]) => {
                  // Only show numeric biomarkers or those with specific display values
                  if (typeof value === 'number' || (typeof value === 'object' && value !== null)) {
                    return (
                      <BiomarkerMetric
                        key={key}
                        name={formatBiomarkerName(key)}
                        value={typeof value === 'number' ? value : JSON.stringify(value)}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Biomarker data not available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Format biomarker names to be more readable
const formatBiomarkerName = (name: string): string => {
  return name
    // Add spaces before capital letters
    .replace(/([A-Z])/g, ' $1')
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Capitalize first letter and trim
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Component for displaying joint angles
const AngularMetric: React.FC<{
  name: string;
  value: number;
  optimal: number;
  range: [number, number];
}> = ({ name, value, optimal, range }) => {
  // Calculate how close the value is to optimal
  const deviation = Math.abs(value - optimal);
  const maxDeviation = Math.max(Math.abs(range[0] - optimal), Math.abs(range[1] - optimal));
  const percentageDeviation = Math.min(100, (deviation / maxDeviation) * 100);
  
  // Determine color based on deviation
  const getColorClass = () => {
    if (percentageDeviation < 30) return 'text-green-600 dark:text-green-400';
    if (percentageDeviation < 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  return (
    <div className="bg-muted/40 p-3 rounded-md">
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className={`text-lg font-semibold ${getColorClass()}`}>
        {value.toFixed(1)}°
      </div>
      <div className="text-xs text-muted-foreground">
        Optimal: {optimal}° ({range[0]}°-{range[1]}°)
      </div>
    </div>
  );
};

// Component for displaying biomarker metrics
const BiomarkerMetric: React.FC<{
  name: string;
  value: number | string;
}> = ({ name, value }) => {
  return (
    <div className="bg-muted/40 p-3 rounded-md">
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className="text-lg font-semibold truncate">
        {typeof value === 'number' ? value.toFixed(2) : value}
      </div>
    </div>
  );
};

export default BiomarkersDisplay;
