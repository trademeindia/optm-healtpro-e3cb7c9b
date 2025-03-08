
import React, { useState } from 'react';
import SymptomCard from './SymptomCard';
import SymptomTrend from './SymptomTrend';
import { ChartData } from './types';
import { calculateTrend } from './utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SymptomCardsContainerProps {
  symptoms: ChartData[];
}

const SymptomCardsContainer: React.FC<SymptomCardsContainerProps> = ({ symptoms }) => {
  const [expandedSymptom, setExpandedSymptom] = useState<number | null>(null);
  
  const toggleExpand = (index: number) => {
    if (expandedSymptom === index) {
      setExpandedSymptom(null);
    } else {
      setExpandedSymptom(index);
    }
  };
  
  return (
    <div className="space-y-3 mt-4">
      <h4 className="text-sm font-medium">Symptom Details</h4>
      
      {symptoms.map((symptom, index) => (
        <div key={index} className="bg-white/50 dark:bg-white/5 rounded-lg border border-border overflow-hidden">
          <div 
            className="p-3 flex justify-between items-center cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => toggleExpand(index)}
          >
            <SymptomCard symptom={symptom} index={index} />
            
            <button className="ml-2 text-muted-foreground p-1 rounded-full hover:bg-secondary">
              {expandedSymptom === index ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {expandedSymptom === index && (
            <div className="px-3 pb-3">
              <SymptomTrend 
                symptom={symptom} 
                trend={calculateTrend(symptom)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SymptomCardsContainer;
