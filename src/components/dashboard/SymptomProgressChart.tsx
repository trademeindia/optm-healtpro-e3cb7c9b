
import React from 'react';
import { useSymptomProgress } from './symptom-progress/useSymptomProgress';
import SymptomChart from './symptom-progress/SymptomChart';
import SymptomCardsContainer from './symptom-progress/SymptomCardsContainer';
import PainReductionCard from './symptom-progress/PainReductionCard';
import { SymptomProgressChartProps } from './symptom-progress/types';

const SymptomProgressChart: React.FC<SymptomProgressChartProps> = ({ className }) => {
  const { symptoms, chartData, painReduction } = useSymptomProgress();
  
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">Symptom Progress</h3>
      
      <PainReductionCard painReduction={painReduction} />
      
      <SymptomChart
        symptoms={symptoms}
        chartData={chartData}
      />
      
      <SymptomCardsContainer symptoms={symptoms} />
    </div>
  );
};

export default SymptomProgressChart;
