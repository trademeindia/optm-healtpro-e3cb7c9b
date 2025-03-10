
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, Info, Calendar } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BiomarkerItemProps } from './types';

const BiomarkerItem: React.FC<BiomarkerItemProps> = ({ biomarker, expanded, onToggle }) => {
  return (
    <Card className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{biomarker.name}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Normal range: {biomarker.normalRange} {biomarker.unit}</p>
                  {biomarker.description && <p>{biomarker.description}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Last updated: {biomarker.lastUpdated}
          </div>
        </div>
        
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium",
          biomarker.status === 'normal' && "bg-green-100 text-green-700",
          biomarker.status === 'elevated' && "bg-yellow-100 text-yellow-700",
          biomarker.status === 'critical' && "bg-red-100 text-red-700",
          biomarker.status === 'low' && "bg-blue-100 text-blue-700"
        )}>
          {biomarker.status.charAt(0).toUpperCase() + biomarker.status.slice(1)}
        </span>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={
                biomarker.status === 'normal' ? "#10b981" :
                biomarker.status === 'elevated' ? "#f59e0b" :
                biomarker.status === 'critical' ? "#ef4444" : "#3b82f6"
              }
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - biomarker.percentage / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold">
            {biomarker.percentage}%
          </div>
        </div>
        
        <div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold mr-1">{biomarker.value}</span>
            <span className="text-sm text-muted-foreground">{biomarker.unit}</span>
            <span className="ml-3 text-muted-foreground text-sm">—</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {biomarker.trend === 'stable' ? 'Stable' : 
               biomarker.trend === 'up' ? 'Increasing' : 'Decreasing'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Range: {biomarker.normalRange} {biomarker.unit}
          </div>
        </div>
      </div>
      
      <button
        className="w-full mt-3 pt-2 border-t border-gray-200 flex items-center justify-center text-xs text-muted-foreground"
        onClick={() => onToggle(biomarker.id)}
      >
        <ChevronDown className={cn("h-4 w-4 mr-1", expanded && "rotate-180")} />
        {expanded ? "Hide Details" : "View Details"}
      </button>
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
          <p className="mb-2">{biomarker.description || "No additional details available."}</p>
          <div className="text-xs text-muted-foreground">
            {biomarker.status === 'normal' ? (
              <p>This biomarker is within normal range.</p>
            ) : biomarker.status === 'elevated' ? (
              <p>This biomarker is elevated above the normal range.</p>
            ) : biomarker.status === 'critical' ? (
              <p>This biomarker is critically elevated and requires attention.</p>
            ) : (
              <p>This biomarker is below the normal range.</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default BiomarkerItem;
