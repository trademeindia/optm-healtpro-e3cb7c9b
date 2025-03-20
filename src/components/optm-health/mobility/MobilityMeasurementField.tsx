
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { MobilityMeasurements } from '@/types/optm-health';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface MobilityMeasurementFieldProps {
  label: string;
  measurement: keyof MobilityMeasurements;
  value: any;
  normalRange: string;
  onChange: (measurement: keyof MobilityMeasurements, field: string, value: any) => void;
  hasSide?: boolean;
  hasDirection?: boolean;
  previousValue?: number;
}

const MobilityMeasurementField: React.FC<MobilityMeasurementFieldProps> = ({
  label,
  measurement,
  value,
  normalRange,
  onChange,
  hasSide = false,
  hasDirection = false,
  previousValue
}) => {
  // Calculate improvement if previous value exists
  const hasImprovement = previousValue !== undefined && value?.value !== undefined;
  
  // Determine if higher or lower values are better for this measurement
  const higherIsBetter = measurement !== 'kneeExtension' && measurement !== 'pelvicTilt';
  
  let improvementPercentage = 0;
  let improvementLabel = '';
  let progressColor = 'bg-gray-200';
  
  if (hasImprovement) {
    const current = parseFloat(value.value);
    
    if (higherIsBetter) {
      // For measurements where higher values are better (like knee flexion)
      improvementPercentage = ((current - previousValue) / previousValue) * 100;
    } else {
      // For measurements where lower values are better (like knee extension)
      improvementPercentage = ((previousValue - current) / previousValue) * 100;
    }
    
    // Cap at 100% for visualization purposes
    improvementPercentage = Math.min(Math.max(improvementPercentage, -100), 100);
    
    // Determine label and color
    if (improvementPercentage >= 75) {
      improvementLabel = 'Significant improvement';
      progressColor = 'bg-green-500';
    } else if (improvementPercentage >= 50) {
      improvementLabel = 'Moderate improvement';
      progressColor = 'bg-green-400';
    } else if (improvementPercentage >= 25) {
      improvementLabel = 'Mild improvement';
      progressColor = 'bg-green-300';
    } else if (improvementPercentage > 0) {
      improvementLabel = 'Minimal improvement';
      progressColor = 'bg-green-200';
    } else if (improvementPercentage === 0) {
      improvementLabel = 'No change';
      progressColor = 'bg-gray-400';
    } else {
      improvementLabel = 'Deterioration';
      progressColor = 'bg-red-400';
    }
  }
  
  return (
    <div className="mb-4 p-4 border rounded-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm text-muted-foreground">Normal Range: {normalRange}</p>
        </div>
        
        {hasImprovement && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <InfoIcon className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className={improvementPercentage > 0 ? "text-green-600" : improvementPercentage < 0 ? "text-red-600" : "text-gray-600"}>
                    {improvementPercentage > 0 ? "+" : ""}{improvementPercentage.toFixed(1)}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{improvementLabel}</p>
                <p className="text-xs mt-1">
                  Previous: {previousValue}{value?.unit || '°'} → Current: {value?.value}{value?.unit || '°'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {hasImprovement && (
        <div className="mb-3">
          <Progress 
            value={improvementPercentage > 0 ? improvementPercentage : 0} 
            max={100}
            className={`h-2 ${progressColor}`} 
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Previous: {previousValue}{value?.unit || '°'}</span>
            <span>{improvementLabel}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor={`${measurement}-value`}>Value (degrees)</Label>
          <Input
            id={`${measurement}-value`}
            type="number"
            step="0.1"
            value={value?.value || ''}
            onChange={(e) => onChange(measurement, 'value', e.target.value)}
            placeholder="Enter value"
          />
        </div>
        
        {hasSide && (
          <div className="space-y-2">
            <Label htmlFor={`${measurement}-side`}>Side</Label>
            <Select
              value={value?.side || 'right'}
              onValueChange={(val) => onChange(measurement, 'side', val)}
            >
              <SelectTrigger id={`${measurement}-side`}>
                <SelectValue placeholder="Select side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="bilateral">Bilateral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {hasDirection && (
          <div className="space-y-2">
            <Label htmlFor={`${measurement}-direction`}>Direction</Label>
            <Select
              value={value?.direction || 'right'}
              onValueChange={(val) => onChange(measurement, 'direction', val)}
            >
              <SelectTrigger id={`${measurement}-direction`}>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilityMeasurementField;
