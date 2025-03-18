
import { useState, useEffect } from 'react';
import { useSymptoms } from '@/contexts/SymptomContext';
import { ChartData } from './types';
import { calculatePainReduction, prepareChartData } from './utils';
import { generateMockSymptomData } from './mockData';

// Custom hook to prepare and manage symptom progress data
export const useSymptomProgress = () => {
  const { symptoms: patientSymptoms, isLoading: contextLoading } = useSymptoms();
  const [symptoms, setSymptoms] = useState<ChartData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [painReduction, setPainReduction] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If we have patient symptoms from context, transform them
      if (patientSymptoms.length > 0) {
        // Group symptoms by name and location
        const groupedSymptoms = patientSymptoms.reduce((acc, symptom) => {
          const key = `${symptom.symptomName}-${symptom.location || 'unknown'}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(symptom);
          return acc;
        }, {} as Record<string, typeof patientSymptoms>);
        
        // Transform to chart data format
        const transformedSymptoms = Object.entries(groupedSymptoms).map(([key, entries], index) => {
          // Use predefined colors or generate based on index
          const colors = ['#ef4444', '#f97316', '#3b82f6', '#10b981', '#8b5cf6'];
          
          return {
            symptomName: entries[0].symptomName,
            color: colors[index % colors.length],
            data: entries.map(entry => ({
              date: entry.date.toISOString().split('T')[0],
              name: entry.date.getDate().toString().padStart(2, '0'),
              value: entry.painLevel
            })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          };
        });
        
        setSymptoms(transformedSymptoms);
      } else if (!contextLoading) {
        // Use mock data if no patient symptoms and context is done loading
        console.log('No real symptom data, using mock data');
        setSymptoms(generateMockSymptomData());
      }
    } catch (err) {
      console.error('Error processing symptom data:', err);
      setError(err instanceof Error ? err : new Error('Failed to process symptom data'));
    } finally {
      setIsLoading(false);
    }
  }, [patientSymptoms, contextLoading]);
  
  useEffect(() => {
    try {
      if (symptoms.length > 0) {
        // Prepare data for the chart
        const prepared = prepareChartData(symptoms);
        setChartData(prepared);
        
        // Calculate pain reduction
        setPainReduction(calculatePainReduction(symptoms));
      }
    } catch (err) {
      console.error('Error preparing chart data:', err);
      setError(err instanceof Error ? err : new Error('Failed to prepare chart data'));
    }
  }, [symptoms]);
  
  return {
    symptoms,
    chartData,
    painReduction,
    isLoading: isLoading || contextLoading,
    error
  };
};
