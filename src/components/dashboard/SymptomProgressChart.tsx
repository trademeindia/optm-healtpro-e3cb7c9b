
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { getSymptomsMockData } from './symptom-progress/mockData';
import { calculatePainReduction, prepareChartData } from './symptom-progress/utils';
import PainReductionCard from './symptom-progress/PainReductionCard';
import SymptomChart from './symptom-progress/SymptomChart';
import SymptomCardsContainer from './symptom-progress/SymptomCardsContainer';
import { SymptomProgressChartProps } from './symptom-progress/types';

const SymptomProgressChart: React.FC<SymptomProgressChartProps> = ({
  className
}) => {
  // Get mock data for symptom tracking
  const symptoms = getSymptomsMockData();

  // Combined data for the chart
  const chartData = prepareChartData(symptoms);

  // Calculate average pain reduction
  const painReduction = calculatePainReduction(symptoms);
  
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
      className="my-[127px]"
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
      
      <SymptomChart symptoms={symptoms} chartData={chartData} />
      
      <SymptomCardsContainer symptoms={symptoms} />
    </motion.div>
  );
};

export default SymptomProgressChart;
