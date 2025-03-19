
import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

export interface PainReductionSummaryProps {
  painReduction: number;
}

const PainReductionSummary: React.FC<PainReductionSummaryProps> = ({ painReduction }) => {
  const isReduction = painReduction > 0;
  
  return (
    <div className="bg-white/50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
      <p className="text-sm text-muted-foreground mb-1">Overall Symptom Change</p>
      <div className="flex items-center gap-2">
        <div className={`flex items-center ${isReduction ? 'text-medical-green' : 'text-medical-red'} text-2xl font-bold`}>
          {isReduction ? (
            <>
              <TrendingDown className="w-5 h-5 mr-1" />
              {Math.abs(painReduction)}%
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5 mr-1" />
              {Math.abs(painReduction)}%
            </>
          )}
        </div>
        <span className="text-muted-foreground text-sm">
          {isReduction ? 'reduction in pain since first assessment' : 'increase in pain since first assessment'}
        </span>
      </div>
    </div>
  );
};

export default PainReductionSummary;
