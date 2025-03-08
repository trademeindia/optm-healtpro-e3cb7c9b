
import React from 'react';
import { TrendingDown, Info } from 'lucide-react';
import { PainReductionProps } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PainReductionCard: React.FC<PainReductionProps> = ({ painReduction }) => {
  const isPositive = painReduction > 0;
  
  return (
    <div className="mb-4 p-3 bg-secondary/30 rounded-lg flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${isPositive ? 'bg-medical-green/20' : 'bg-medical-red/20'} flex items-center justify-center`}>
        <TrendingDown className={`w-5 h-5 ${isPositive ? 'text-medical-green' : 'text-medical-red'}`} />
      </div>
      <div className="flex-1">
        <div className="font-medium flex items-center gap-1">
          Overall Pain Change
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span><Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <p className="text-xs">
                  This represents the average percentage change in pain levels across all tracked symptoms since you started tracking.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className={`text-2xl font-bold ${isPositive ? 'text-medical-green' : 'text-medical-red'}`}>
          {isPositive ? `↓ ${Math.abs(painReduction)}%` : `↑ ${Math.abs(painReduction)}%`}
        </div>
      </div>
    </div>
  );
};

export default PainReductionCard;
