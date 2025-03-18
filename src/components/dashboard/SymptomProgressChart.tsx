
import React from 'react';
import { useSymptomProgress } from './symptom-progress/useSymptomProgress';
import { SymptomProgressChartProps } from './symptom-progress/types';
import { 
  PainReductionSummary,
  ChartSection,
  SymptomDetails
} from './symptom-progress/progress-chart';
import { Card } from '@/components/ui/card';

const SymptomProgressChart: React.FC<SymptomProgressChartProps> = ({ className }) => {
  const { symptoms, chartData, painReduction, isLoading, error } = useSymptomProgress();
  
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">Symptom Progress</h3>
      
      {error ? (
        <Card className="p-4 mb-4 text-center text-muted-foreground">
          <p>There was an error loading your symptom data.</p>
        </Card>
      ) : isLoading ? (
        <Card className="p-4 mb-4 text-center text-muted-foreground">
          <p>Loading symptom data...</p>
        </Card>
      ) : (
        <>
          <PainReductionSummary painReduction={painReduction} />
          
          <ChartSection 
            symptoms={symptoms}
            chartData={chartData}
          />
          
          <SymptomDetails symptoms={symptoms} />
        </>
      )}
    </div>
  );
};

export default SymptomProgressChart;
