
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, TrendingDown } from 'lucide-react';
import PainReductionCard from './symptom-progress/PainReductionCard';
import SymptomChart from './symptom-progress/SymptomChart';
import SymptomCardsContainer from './symptom-progress/SymptomCardsContainer';
import { useSymptomProgress } from './symptom-progress/useSymptomProgress';
import { SymptomProgressChartProps } from './symptom-progress/types';
import { format } from 'date-fns';

const SymptomProgressChart: React.FC<SymptomProgressChartProps> = ({
  className
}) => {
  const { symptoms, chartData, painReduction } = useSymptomProgress();
  
  // Get the range of dates for the chart
  const getDateRange = () => {
    if (!symptoms.length || !symptoms[0].data.length) {
      return 'No data available';
    }
    
    const firstData = symptoms[0].data;
    const startDate = new Date(firstData[0].date);
    const endDate = new Date(firstData[firstData.length - 1].date);
    
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };
  
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.5
      }}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg font-semibold">Symptom Progress</h3>
          <p className="text-sm text-muted-foreground">
            Track improvement of symptoms over time
          </p>
        </div>
        <Activity className="w-5 h-5 text-primary" />
      </div>
      
      <PainReductionCard painReduction={painReduction} />
      
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm flex items-center text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          {getDateRange()}
        </div>
        
        {painReduction > 0 && (
          <div className="text-xs bg-medical-green/10 text-medical-green px-2 py-1 rounded-full flex items-center">
            <TrendingDown className="w-3 h-3 mr-1" />
            Showing improvement
          </div>
        )}
      </div>
      
      <SymptomChart symptoms={symptoms} chartData={chartData} />
      
      <SymptomCardsContainer symptoms={symptoms} />
    </motion.div>
  );
};

export default SymptomProgressChart;
