
import { biomarkerValues } from './sampleData';

/**
 * Intelligently determines biomarker type from filename
 */
export const determineBiomarkerFromFileName = (fileName?: string): string => {
  if (!fileName) {
    // If no filename, return a random biomarker
    const biomarkerTypes = Object.keys(biomarkerValues);
    return biomarkerTypes[Math.floor(Math.random() * biomarkerTypes.length)];
  }
  
  // Convert filename to lowercase for easier matching
  const lowerFileName = fileName.toLowerCase();
  
  // Try to match filename with specific biomarker types
  if (lowerFileName.includes('vitamin d') || lowerFileName.includes('vit d')) {
    return 'Vitamin D';
  } else if (lowerFileName.includes('chol') || lowerFileName.includes('lipid')) {
    return 'Cholesterol';
  } else if (lowerFileName.includes('glucose') || lowerFileName.includes('blood sugar')) {
    return 'Glucose';
  } else if (lowerFileName.includes('iron') || lowerFileName.includes('fe')) {
    return 'Iron';
  } else if (lowerFileName.includes('a1c') || lowerFileName.includes('hba1c')) {
    return 'Hemoglobin A1C';
  } else if (lowerFileName.includes('b12') || lowerFileName.includes('cobalamin')) {
    return 'Vitamin B12';
  } else if (lowerFileName.includes('tsh') || lowerFileName.includes('thyroid')) {
    return 'Thyroid Stimulating Hormone';
  } else if (lowerFileName.includes('ferritin')) {
    return 'Ferritin';
  } else if (lowerFileName.includes('crp') || lowerFileName.includes('c-reactive')) {
    return 'C-Reactive Protein';
  } else if (lowerFileName.includes('hdl')) {
    return 'HDL Cholesterol';
  } else if (lowerFileName.includes('ldl')) {
    return 'LDL Cholesterol';
  } else if (lowerFileName.includes('triglyceride') || lowerFileName.includes('tg')) {
    return 'Triglycerides';
  } else if (lowerFileName.includes('bp') || lowerFileName.includes('blood pressure')) {
    return 'Blood Pressure';
  } else if (lowerFileName.includes('b6') || lowerFileName.includes('pyridoxine')) {
    return 'Vitamin B6';
  }
  
  // If no specific match is found, return a random biomarker
  const biomarkerTypes = Object.keys(biomarkerValues);
  return biomarkerTypes[Math.floor(Math.random() * biomarkerTypes.length)];
};
