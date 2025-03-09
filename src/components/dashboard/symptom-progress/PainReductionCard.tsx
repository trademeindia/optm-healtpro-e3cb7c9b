
import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingDown } from 'lucide-react';
import { PainReductionProps } from './types';

const PainReductionCard: React.FC<PainReductionProps> = ({ painReduction }) => {
  // Determine if the trend is positive (pain reduction) or negative
  const isPositive = painReduction > 0;
  
  return (
    <div className="bg-white/50 dark:bg-white/5 rounded-lg border border-border p-3 mb-4">
      <h4 className="text-sm font-medium mb-1">Pain Reduction</h4>
      
      <div className="flex items-baseline gap-2">
        <span className={cn(
          "text-2xl font-bold",
          isPositive ? "text-medical-green" : "text-medical-red"
        )}>
          {isPositive ? painReduction : 0}%
        </span>
        
        <div className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium flex items-center",
          isPositive ? "bg-medical-green/20 text-medical-green" : "bg-medical-red/20 text-medical-red"
        )}>
          {isPositive ? (
            <>
              <TrendingDown className="w-3 h-3 mr-1" />
              <span>Improving</span>
            </>
          ) : (
            <span>No change</span>
          )}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-1">
        {isPositive 
          ? "Average reduction in pain levels since first record" 
          : "Start tracking your symptoms to see progress over time"}
      </p>
    </div>
  );
};

export default PainReductionCard;
