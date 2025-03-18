
import { ChartData, TrendData } from './types';

/**
 * Calculates the average pain reduction percentage across all symptoms
 * @param symptoms Array of symptom data
 * @returns Rounded percentage of pain reduction
 */
export const calculatePainReduction = (symptoms: ChartData[]): number => {
  if (!symptoms.length) return 0;
  
  const reductions = symptoms.map(symptom => {
    if (!symptom.data.length || symptom.data.length < 2) return 0;
    
    const firstValue = symptom.data[0].value;
    const lastValue = symptom.data[symptom.data.length - 1].value;
    
    // Ensure we're not dividing by zero
    if (firstValue === 0) return 0;
    
    // Calculate percent reduction (negative means worse)
    return (firstValue - lastValue) / firstValue * 100;
  });
  
  // Filter out any NaN or invalid values
  const validReductions = reductions.filter(val => !isNaN(val) && isFinite(val));
  
  if (validReductions.length === 0) return 0;
  
  const avgReduction = validReductions.reduce((sum, value) => sum + value, 0) / validReductions.length;
  return Math.round(avgReduction);
};

/**
 * Prepares the data for the chart component by combining all symptom datasets
 * @param symptoms Array of symptom data
 * @returns Formatted data ready for Recharts
 */
export const prepareChartData = (symptoms: ChartData[]) => {
  if (!symptoms.length || !symptoms[0].data.length) return [];
  
  // Get all unique dates across all symptoms
  const allDates = new Set<string>();
  symptoms.forEach(symptom => {
    symptom.data.forEach(dataPoint => {
      allDates.add(dataPoint.date);
    });
  });
  
  // Sort dates chronologically
  const sortedDates = Array.from(allDates).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
  // Create data points for each date, filling in values for each symptom
  return sortedDates.map(date => {
    const dataPoint: any = {
      name: symptoms.find(s => 
        s.data.find(d => d.date === date)
      )?.data.find(d => d.date === date)?.name || 
      new Date(date).getDate().toString().padStart(2, '0')
    };
    
    symptoms.forEach(symptom => {
      const matchingDataPoint = symptom.data.find(d => d.date === date);
      dataPoint[symptom.symptomName] = matchingDataPoint ? matchingDataPoint.value : null;
    });
    
    return dataPoint;
  });
};

/**
 * Calculates weekly and monthly trends for a symptom
 * @param symptom The symptom data to analyze
 * @returns Object containing weekly and monthly change percentages
 */
export const calculateTrend = (symptom: ChartData): TrendData => {
  if (!symptom.data.length || symptom.data.length < 2) {
    return { weeklyChange: 0, monthlyChange: 0 };
  }
  
  // Sort data by date
  const sortedData = [...symptom.data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const lastValue = sortedData[sortedData.length - 1].value;
  
  // Weekly trend (last 7 entries or less if not available)
  const weeklyData = sortedData.length >= 7 ? sortedData.slice(-7) : sortedData;
  const weekStartValue = weeklyData[0].value;
  const weeklyChange = weekStartValue === 0 ? 0 : 
    ((lastValue - weekStartValue) / weekStartValue) * 100;
  
  // Monthly trend (last 30 entries or less if not available)
  const monthlyData = sortedData.length >= 30 ? sortedData.slice(-30) : sortedData;
  const monthStartValue = monthlyData[0].value;
  const monthlyChange = monthStartValue === 0 ? 0 : 
    ((lastValue - monthStartValue) / monthStartValue) * 100;
  
  return {
    weeklyChange: isNaN(weeklyChange) ? 0 : Math.round(weeklyChange),
    monthlyChange: isNaN(monthlyChange) ? 0 : Math.round(monthlyChange)
  };
};

/**
 * Gets a color based on the pain level
 * @param painLevel Pain level from 0-10
 * @returns Appropriate color for the pain level
 */
export const getPainLevelColor = (painLevel: number): string => {
  if (painLevel <= 3) return 'text-medical-green';
  if (painLevel <= 6) return 'text-medical-yellow';
  return 'text-medical-red';
};

/**
 * Creates a formatted display string for a date
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDateForDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
