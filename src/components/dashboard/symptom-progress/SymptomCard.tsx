
import React from 'react';
import { SymptomCardProps } from './types';

const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, index }) => {
  const firstValue = symptom.data[0].value;
  const lastValue = symptom.data[symptom.data.length - 1].value;
  const reduction = (firstValue - lastValue) / firstValue * 100;
  
  return (
    <div 
      key={index} 
      className="flex-1 min-w-[120px] bg-white/50 dark:bg-white/5 p-3 rounded-lg border border-border"
    >
      <div className="text-sm font-medium mb-1">{symptom.symptomName}</div>
      <div className="flex items-baseline gap-1">
        <span 
          className="text-xl font-bold" 
          style={{
            color: symptom.color
          }}
        >
          {lastValue}
        </span>
        <span className="text-xs text-muted-foreground">/10</span>
      </div>
      <div className="flex items-center mt-1">
        <div className="text-xs bg-medical-green/20 text-medical-green px-1.5 py-0.5 rounded-full">
          ↓ {Math.round(reduction)}%
        </div>
      </div>
    </div>
  );
};

export default SymptomCard;
