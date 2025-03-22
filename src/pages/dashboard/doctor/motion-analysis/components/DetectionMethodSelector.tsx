
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DetectionMethodSelectorProps {
  currentMethod: 'posenet' | 'human';
  onMethodChange: (method: 'posenet' | 'human') => void;
  disabled?: boolean;
}

const DetectionMethodSelector: React.FC<DetectionMethodSelectorProps> = ({
  currentMethod,
  onMethodChange,
  disabled = false
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          Detection Method
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  PoseNet is TensorFlow's original pose detection model. Human detection is a newer, more accurate approach.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentMethod}
          onValueChange={(value) => onMethodChange(value as 'posenet' | 'human')}
          disabled={disabled}
        >
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="posenet" id="posenet" disabled={disabled} />
            <Label htmlFor="posenet" className={disabled ? "opacity-50" : ""}>
              TensorFlow PoseNet
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="human" id="human" disabled={disabled} />
            <Label htmlFor="human" className={disabled ? "opacity-50" : ""}>
              Human Detection
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default DetectionMethodSelector;
