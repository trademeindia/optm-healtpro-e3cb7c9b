
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyAngles } from '../posture-monitor/types';
import { Activity, AlertTriangle, Heart, Ruler } from 'lucide-react';

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
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="angles">Joint Angles</TabsTrigger>
            <TabsTrigger value="biomarkers">Performance</TabsTrigger>
            <TabsTrigger value="health">Health Metrics</TabsTrigger>
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
                  optimal={100}
                  range={[80, 120]}
                />
              )}
              
              {angles.shoulderAngle !== null && (
                <AngularMetric 
                  name="Shoulder Angle" 
                  value={angles.shoulderAngle} 
                  optimal={180}
                  range={[160, 180]}
                />
              )}
              
              {angles.elbowAngle !== null && (
                <AngularMetric 
                  name="Elbow Angle" 
                  value={angles.elbowAngle} 
                  optimal={170}
                  range={[160, 180]}
                />
              )}
              
              {angles.ankleAngle !== null && (
                <AngularMetric 
                  name="Ankle Angle" 
                  value={angles.ankleAngle} 
                  optimal={90}
                  range={[80, 100]}
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
                {biomarkers.bodyPosture !== null && (
                  <BiomarkerMetric
                    name="Posture Symmetry"
                    value={biomarkers.bodyPosture}
                    unit="%"
                    icon={<Ruler className="h-4 w-4" />}
                    isPercentage={true}
                  />
                )}
                
                {biomarkers.balanceScore !== null && (
                  <BiomarkerMetric
                    name="Balance"
                    value={biomarkers.balanceScore}
                    unit="%"
                    icon={<Ruler className="h-4 w-4" />}
                    isPercentage={true}
                  />
                )}
                
                {biomarkers.bodyAlignment !== null && (
                  <BiomarkerMetric
                    name="Body Alignment"
                    value={biomarkers.bodyAlignment}
                    unit="%"
                    icon={<Ruler className="h-4 w-4" />}
                    isPercentage={true}
                  />
                )}
                
                {biomarkers.kneeFlexion !== null && (
                  <BiomarkerMetric
                    name="Knee Flexion"
                    value={biomarkers.kneeFlexion}
                    unit="%"
                    icon={<Ruler className="h-4 w-4" />}
                    isPercentage={true}
                  />
                )}
                
                {biomarkers.hipHinge !== null && (
                  <BiomarkerMetric
                    name="Hip Hinge"
                    value={biomarkers.hipHinge}
                    unit="%"
                    icon={<Ruler className="h-4 w-4" />}
                    isPercentage={true}
                  />
                )}
                
                {biomarkers.shoulderMobility !== null && (
                  <BiomarkerMetric
                    name="Shoulder Mobility"
                    value={biomarkers.shoulderMobility}
                    unit="%"
                    icon={<Ruler className="h-4 w-4" />}
                    isPercentage={true}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Performance metrics not available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="health">
            {hasBiomarkers ? (
              <div className="space-y-4">
                {biomarkers.injuryRiskScore !== null && (
                  <HealthMetric
                    name="Injury Risk"
                    value={biomarkers.injuryRiskScore}
                    interpretation="lower is better"
                    severity="inverse"
                    icon={<AlertTriangle className="h-4 w-4" />}
                  />
                )}
                
                {biomarkers.jointStressIndex !== null && (
                  <HealthMetric
                    name="Joint Stress"
                    value={biomarkers.jointStressIndex}
                    interpretation="lower is better"
                    severity="inverse"
                    icon={<Heart className="h-4 w-4" />}
                  />
                )}
                
                {biomarkers.stabilityIndex !== null && (
                  <HealthMetric
                    name="Stability"
                    value={biomarkers.stabilityIndex}
                    interpretation="higher is better"
                    severity="normal"
                    icon={<Activity className="h-4 w-4" />}
                  />
                )}
                
                {biomarkers.movementSymmetry !== null && (
                  <HealthMetric
                    name="Movement Symmetry"
                    value={biomarkers.movementSymmetry}
                    interpretation="higher is better"
                    severity="normal"
                    icon={<Ruler className="h-4 w-4" />}
                  />
                )}
                
                {biomarkers.weightDistribution !== null && (
                  <HealthMetric
                    name="Weight Distribution"
                    value={biomarkers.weightDistribution}
                    interpretation="higher is better"
                    severity="normal"
                    icon={<Ruler className="h-4 w-4" />}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Health metrics not available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
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
        {Math.round(value)}°
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
  unit?: string;
  icon?: React.ReactNode;
  isPercentage?: boolean;
}> = ({ name, value, unit = "", icon, isPercentage = false }) => {
  const getValueColor = () => {
    if (typeof value !== 'number' || !isPercentage) return 'text-foreground';
    
    if (value >= 80) return 'text-green-600 dark:text-green-400';
    if (value >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  return (
    <div className="bg-muted/40 p-3 rounded-md">
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        {icon && icon}
        <span>{name}</span>
      </div>
      <div className={`text-lg font-semibold truncate ${getValueColor()}`}>
        {typeof value === 'number' ? 
          (isPercentage ? Math.round(value) : value.toFixed(1)) : 
          value}
        {unit}
      </div>
    </div>
  );
};

// Component for displaying health metrics with severity indicators
const HealthMetric: React.FC<{
  name: string;
  value: number;
  interpretation: string;
  severity: "normal" | "inverse";
  icon?: React.ReactNode;
}> = ({ name, value, interpretation, severity, icon }) => {
  const getSeverityClass = () => {
    if (severity === "inverse") {
      // For metrics where lower is better (risk scores)
      if (value < 30) return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-900";
      if (value < 70) return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900";
      return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-900";
    } else {
      // For metrics where higher is better
      if (value >= 70) return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-900";
      if (value >= 30) return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900";
      return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-900";
    }
  };
  
  const getValueColor = () => {
    if (severity === "inverse") {
      if (value < 30) return "text-green-700 dark:text-green-400";
      if (value < 70) return "text-yellow-700 dark:text-yellow-400";
      return "text-red-700 dark:text-red-400";
    } else {
      if (value >= 70) return "text-green-700 dark:text-green-400";
      if (value >= 30) return "text-yellow-700 dark:text-yellow-400";
      return "text-red-700 dark:text-red-400";
    }
  };
  
  return (
    <div className={`rounded-md p-3 border ${getSeverityClass()}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm font-medium">
          {icon && icon}
          <span>{name}</span>
        </div>
        <div className={`text-lg font-bold ${getValueColor()}`}>
          {Math.round(value)}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {interpretation}
      </div>
    </div>
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

export default BiomarkersDisplay;
