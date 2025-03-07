
import React from 'react';
import SymptomCard from './SymptomCard';
import { ChartData } from './types';

interface SymptomCardsContainerProps {
  symptoms: ChartData[];
}

const SymptomCardsContainer: React.FC<SymptomCardsContainerProps> = ({ symptoms }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {symptoms.map((symptom, index) => (
        <SymptomCard key={index} symptom={symptom} index={index} />
      ))}
    </div>
  );
};

export default SymptomCardsContainer;
