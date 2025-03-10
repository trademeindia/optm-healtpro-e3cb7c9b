import React from 'react';
import { useSymptomProgress } from './symptom-progress/useSymptomProgress';
import { SymptomProgressChartProps } from './symptom-progress/types';
import { PainReductionSummary, ChartSection, SymptomDetails } from './symptom-progress/progress-chart';
const SymptomProgressChart: React.FC<SymptomProgressChartProps> = ({
  className
}) => {
  const {
    symptoms,
    chartData,
    painReduction
  } = useSymptomProgress();
  return;
};
export default SymptomProgressChart;