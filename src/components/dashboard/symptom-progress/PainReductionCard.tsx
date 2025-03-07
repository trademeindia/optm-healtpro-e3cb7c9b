
import React from 'react';
import { TrendingDown } from 'lucide-react';
import { PainReductionProps } from './types';

const PainReductionCard: React.FC<PainReductionProps> = ({ painReduction }) => {
  return (
    <div className="mb-4 p-3 bg-secondary/30 rounded-lg flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-medical-green/20 flex items-center justify-center">
        <TrendingDown className="w-5 h-5 text-medical-green" />
      </div>
      <div>
        <div className="font-medium">Overall Pain Reduction</div>
        <div className="text-2xl font-bold text-medical-green">{painReduction}%</div>
      </div>
    </div>
  );
};

export default PainReductionCard;
