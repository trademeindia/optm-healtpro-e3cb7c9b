
import { useState } from 'react';

export const useExpandableSymptom = () => {
  const [expandedSymptom, setExpandedSymptom] = useState<number | null>(null);
  
  const toggleExpand = (index: number) => {
    if (expandedSymptom === index) {
      setExpandedSymptom(null);
    } else {
      setExpandedSymptom(index);
    }
  };
  
  return {
    expandedSymptom,
    toggleExpand
  };
};
