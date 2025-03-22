
import React from 'react';
import { Zap, CpuIcon, Battery } from 'lucide-react';

interface PerformanceModeSelectorProps {
  currentMode: 'high' | 'balanced' | 'low';
  onChange: (mode: 'high' | 'balanced' | 'low') => void;
  disabled?: boolean;
}

const PerformanceModeSelector: React.FC<PerformanceModeSelectorProps> = ({
  currentMode,
  onChange,
  disabled = false
}) => {
  const modes = [
    { 
      id: 'high', 
      label: 'High Quality', 
      description: 'Best accuracy, higher resource usage',
      icon: <Zap className="h-4 w-4" />
    },
    { 
      id: 'balanced', 
      label: 'Balanced', 
      description: 'Good accuracy with optimized performance',
      icon: <CpuIcon className="h-4 w-4" />
    },
    { 
      id: 'low', 
      label: 'Low Power', 
      description: 'Better performance on slower devices',
      icon: <Battery className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium mb-1">Performance Mode</div>
      <div className="grid grid-cols-3 gap-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`p-2 rounded border text-left ${
              currentMode === mode.id 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border bg-background hover:bg-accent'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !disabled && onChange(mode.id as 'high' | 'balanced' | 'low')}
            disabled={disabled}
            title={disabled ? 'Stop tracking to change mode' : mode.description}
          >
            <div className="flex items-center gap-1 mb-1">
              {mode.icon}
              <span className="text-xs font-medium">{mode.label}</span>
            </div>
            <p className="text-xs text-muted-foreground hidden md:block">{mode.description}</p>
          </button>
        ))}
      </div>
      {disabled && (
        <p className="text-xs text-muted-foreground">Stop tracking to change performance mode</p>
      )}
    </div>
  );
};

export default PerformanceModeSelector;
