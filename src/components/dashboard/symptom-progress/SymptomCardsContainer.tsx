
import React from 'react';
import SymptomCardItem from './SymptomCardItem';
import { ChartData } from './types';
import { useExpandableSymptom } from './useExpandableSymptom';

interface SymptomCardsContainerProps {
  symptoms: ChartData[];
}

const SymptomCardsContainer: React.FC<SymptomCardsContainerProps> = ({ symptoms }) => {
  const { expandedSymptom, toggleExpand } = useExpandableSymptom();
  
  return (
    <div className="space-y-3 mt-4">
      <h4 className="text-sm font-medium">Symptom Details</h4>
      
      {symptoms.map((symptom, index) => (
        <SymptomCardItem
          key={index}
          symptom={symptom}
          index={index}
          isExpanded={expandedSymptom === index}
          onToggle={() => toggleExpand(index)}
        />
      ))}
    </div>
  );
};

export default SymptomCardsContainer;
