
import React from 'react';
import SymptomCardsContainer from '../SymptomCardsContainer';
import { ChartData } from '../types';

interface SymptomDetailsProps {
  symptoms: ChartData[];
}

const SymptomDetails: React.FC<SymptomDetailsProps> = ({ symptoms }) => {
  return <SymptomCardsContainer symptoms={symptoms} />;
};

export default SymptomDetails;
