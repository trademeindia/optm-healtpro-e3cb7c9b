
import React from 'react';
import { ExerciseMetrics } from './types';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Circle,
  LucideIcon,
  Timer,
  Dumbbell,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: ExerciseMetrics;
}

const MetricItem: React.FC<{
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}> = ({ icon: Icon, label, value, color = "text-primary" }) => (
  <div className="flex items-center gap-2">
    <Icon className={`h-5 w-5 ${color}`} />
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Exercise Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Accuracy meter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Form Accuracy</span>
            <span className="text-sm font-medium">{metrics.accuracy}%</span>
          </div>
          <Progress value={metrics.accuracy} className="h-2" />
        </div>
        
        {/* Rep counts */}
        <div className="grid grid-cols-2 gap-4">
          <MetricItem 
            icon={CheckCircle2} 
            label="Good Reps" 
            value={metrics.correctReps}
            color="text-green-500"
          />
          <MetricItem 
            icon={XCircle} 
            label="Form Errors" 
            value={metrics.incorrectReps}
            color="text-amber-500"
          />
        </div>
        
        {/* Range of motion */}
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Range of Motion</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground">Avg</p>
              <p className="text-lg font-bold">{metrics.rangeOfMotion.average}°</p>
            </div>
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground">Min</p>
              <p className="text-lg font-bold">{metrics.rangeOfMotion.min > 0 ? metrics.rangeOfMotion.min + '°' : '-'}</p>
            </div>
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground">Max</p>
              <p className="text-lg font-bold">{metrics.rangeOfMotion.max > 0 ? metrics.rangeOfMotion.max + '°' : '-'}</p>
            </div>
          </div>
        </div>
        
        {/* Session info */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <MetricItem 
            icon={Dumbbell} 
            label="Total Reps" 
            value={metrics.reps} 
          />
          <MetricItem 
            icon={Timer} 
            label="Duration" 
            value={formatTime(metrics.sessionDuration)} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
