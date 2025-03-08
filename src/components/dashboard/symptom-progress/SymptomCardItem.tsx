
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SymptomCard from './SymptomCard';
import SymptomTrend from './SymptomTrend';
import { ChartData } from './types';
import { calculateTrend } from './utils';

interface SymptomCardItemProps {
  symptom: ChartData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const SymptomCardItem: React.FC<SymptomCardItemProps> = ({
  symptom,
  index,
  isExpanded,
  onToggle
}) => {
  return (
    <div className="bg-white/50 dark:bg-white/5 rounded-lg border border-border overflow-hidden">
      <div 
        className="p-3 flex justify-between items-center cursor-pointer hover:bg-secondary/20 transition-colors"
        onClick={onToggle}
      >
        <SymptomCard symptom={symptom} index={index} />
        
        <button className="ml-2 text-muted-foreground p-1 rounded-full hover:bg-secondary">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="px-3 pb-3">
          <SymptomTrend 
            symptom={symptom} 
            trend={calculateTrend(symptom)}
          />
        </div>
      )}
    </div>
  );
};

export default SymptomCardItem;
