
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gauge, Zap, Battery } from 'lucide-react';
import { PerformanceModeSelectorProps } from '../types';

const PerformanceModeSelector: React.FC<PerformanceModeSelectorProps> = ({
  currentMode,
  onChange,
  disabled = false
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-xs text-muted-foreground flex items-center">
        <Gauge className="h-3 w-3 mr-1" />
        <span>Performance Mode:</span>
      </div>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant={currentMode === 'high' ? 'default' : 'outline'}
          className="flex items-center gap-1 h-7 px-2 text-xs"
          onClick={() => onChange('high')}
          disabled={disabled}
        >
          <Zap className="h-3 w-3" />
          <span>High</span>
        </Button>
        <Button
          size="sm"
          variant={currentMode === 'balanced' ? 'default' : 'outline'}
          className="flex items-center gap-1 h-7 px-2 text-xs"
          onClick={() => onChange('balanced')}
          disabled={disabled}
        >
          <Gauge className="h-3 w-3" />
          <span>Balanced</span>
        </Button>
        <Button
          size="sm"
          variant={currentMode === 'low' ? 'default' : 'outline'}
          className="flex items-center gap-1 h-7 px-2 text-xs"
          onClick={() => onChange('low')}
          disabled={disabled}
        >
          <Battery className="h-3 w-3" />
          <span>Low Power</span>
        </Button>
      </div>
    </div>
  );
};

export default PerformanceModeSelector;
