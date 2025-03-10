
import { Biomarker } from '@/data/mockBiomarkerData';
import { determineBiomarkerFromFileName } from './fileNameMatcher';
import { determineTrend } from './trendUtils';
import { biomarkerValues } from './sampleData';

/**
 * Generates a biomarker based on the given filename
 */
export const generateBiomarker = (fileName?: string): Biomarker => {
  // Intelligently determine biomarker type based on filename
  const biomarkerName = determineBiomarkerFromFileName(fileName);
  
  const selectedBiomarker = biomarkerValues[biomarkerName];
  const trend = determineTrend(selectedBiomarker.status);

  // Create a unique ID using the biomarker name and timestamp
  const uniqueId = `bm-${biomarkerName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  // Add slight variation to values to make them more realistic
  const variationPercentage = (Math.random() * 0.06) - 0.03; // -3% to +3%
  let adjustedValue = selectedBiomarker.value;
  
  // Only apply variation to numeric values
  if (typeof adjustedValue === 'number') {
    adjustedValue = +(adjustedValue * (1 + variationPercentage)).toFixed(1);
  }

  return {
    id: uniqueId,
    name: biomarkerName,
    value: adjustedValue,
    unit: selectedBiomarker.unit,
    normalRange: selectedBiomarker.normalRange,
    status: selectedBiomarker.status,
    timestamp: new Date().toISOString(),
    percentage: selectedBiomarker.percentage,
    trend: trend,
    description: selectedBiomarker.description,
    possibleCauses: selectedBiomarker.possibleCauses,
    recommendations: selectedBiomarker.recommendations
  };
};
