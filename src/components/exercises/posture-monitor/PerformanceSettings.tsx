
import React from 'react';
import { PoseDetectionConfig } from './poseDetectionTypes';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PERFORMANCE_CONFIGS, getOptimizedConfig } from './utils/configUtils';
import { X } from 'lucide-react';

interface PerformanceSettingsProps {
  currentConfig: PoseDetectionConfig;
  onConfigChange: (config: Partial<PoseDetectionConfig>) => void;
  onClose: () => void;
}

const PerformanceSettings: React.FC<PerformanceSettingsProps> = ({
  currentConfig,
  onConfigChange,
  onClose
}) => {
  const handleOptimizationChange = (value: string) => {
    const level = value as 'performance' | 'balanced' | 'accuracy';
    const preset = level === 'performance' 
      ? PERFORMANCE_CONFIGS.low 
      : level === 'balanced' 
        ? PERFORMANCE_CONFIGS.medium 
        : PERFORMANCE_CONFIGS.high;
    
    onConfigChange({
      ...preset,
      optimizationLevel: level
    });
  };
  
  const handleFrameSkipChange = (value: number[]) => {
    onConfigChange({ frameskip: value[0] });
  };
  
  const handleResetToDefault = () => {
    onConfigChange(getOptimizedConfig());
  };

  return (
    <div className="p-4 mb-2 border rounded-lg bg-muted/30 relative">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <X className="h-4 w-4" />
      </button>
      
      <h3 className="text-sm font-medium mb-4">Performance Settings</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">Optimization Level</Label>
          </div>
          
          <RadioGroup 
            value={currentConfig.optimizationLevel}
            onValueChange={handleOptimizationChange}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="performance" id="performance" />
              <Label htmlFor="performance" className="text-xs">Performance</Label>
            </div>
            
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced" className="text-xs">Balanced</Label>
            </div>
            
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="accuracy" id="accuracy" />
              <Label htmlFor="accuracy" className="text-xs">Accuracy</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">Frame Skip (Higher = Better Performance)</Label>
            <span className="text-xs text-muted-foreground">
              {currentConfig.frameskip === 0 
                ? 'No skip' 
                : `Skip ${currentConfig.frameskip} frame${currentConfig.frameskip > 1 ? 's' : ''}`}
            </span>
          </div>
          
          <Slider
            value={[currentConfig.frameskip]}
            min={0}
            max={3}
            step={1}
            onValueChange={handleFrameSkipChange}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetToDefault}
            className="text-xs"
          >
            Reset to Default
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Choose "Performance" for smoother operation on low-end devices. 
          "Accuracy" provides better pose detection but may be slower.
        </p>
      </div>
    </div>
  );
};

export default PerformanceSettings;
