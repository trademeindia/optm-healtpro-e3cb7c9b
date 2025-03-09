import { Biomarker } from '@/data/mockBiomarkerData';

// Types for the biomarker values
type BiomarkerStatus = 'normal' | 'elevated' | 'low' | 'critical';

interface BiomarkerValue {
  value: number;
  unit: string;
  normalRange: string;
  status: BiomarkerStatus;
  percentage: number;
  description: string;
}

interface BiomarkerValues {
  [key: string]: BiomarkerValue;
}

// Enhanced sample values for different biomarker types with more comprehensive information
const biomarkerValues: BiomarkerValues = {
  'Vitamin D': { 
    value: 28, 
    unit: 'ng/mL', 
    normalRange: '30-50', 
    status: 'low', 
    percentage: 56,
    description: 'Vitamin D helps your body absorb calcium and is essential for bone health, immune function, and reducing inflammation.'
  },
  'Cholesterol': { 
    value: 195, 
    unit: 'mg/dL', 
    normalRange: '125-200', 
    status: 'normal', 
    percentage: 78,
    description: 'Total cholesterol is a measure of all cholesterol in your blood. Mainly composed of HDL (good) and LDL (bad) cholesterol.'
  },
  'Glucose': { 
    value: 110, 
    unit: 'mg/dL', 
    normalRange: '70-99', 
    status: 'elevated', 
    percentage: 65,
    description: 'Blood glucose (sugar) is your body\'s main source of energy. Elevated levels may indicate prediabetes or diabetes.'
  },
  'Iron': { 
    value: 80, 
    unit: 'μg/dL', 
    normalRange: '60-170', 
    status: 'normal', 
    percentage: 82,
    description: 'Iron is necessary for producing hemoglobin, which helps red blood cells deliver oxygen throughout your body.'
  },
  'Hemoglobin A1C': { 
    value: 5.9, 
    unit: '%', 
    normalRange: '4.0-5.6', 
    status: 'elevated', 
    percentage: 62,
    description: 'HbA1C measures your average blood sugar level over the past 2-3 months, used to diagnose and monitor diabetes.'
  },
  'Vitamin B12': { 
    value: 220, 
    unit: 'pg/mL', 
    normalRange: '200-900', 
    status: 'low', 
    percentage: 45,
    description: 'Vitamin B12 is essential for nerve function, DNA production, and the formation of red blood cells.'
  },
  'Thyroid Stimulating Hormone': { 
    value: 4.8, 
    unit: 'mIU/L', 
    normalRange: '0.4-4.0', 
    status: 'elevated', 
    percentage: 58,
    description: 'TSH controls the production of thyroid hormones. Elevated levels may indicate an underactive thyroid (hypothyroidism).'
  },
  'Ferritin': { 
    value: 15, 
    unit: 'ng/mL', 
    normalRange: '20-250', 
    status: 'low', 
    percentage: 40,
    description: 'Ferritin is a blood protein that contains iron. Low levels can indicate iron deficiency.'
  },
  'C-Reactive Protein': { 
    value: 4.2, 
    unit: 'mg/L', 
    normalRange: '0.0-3.0', 
    status: 'elevated', 
    percentage: 52,
    description: 'CRP is a marker of inflammation in the body. Elevated levels may indicate infection or chronic inflammation.'
  },
  'HDL Cholesterol': { 
    value: 62, 
    unit: 'mg/dL', 
    normalRange: '40-60', 
    status: 'normal', 
    percentage: 88,
    description: 'HDL (good) cholesterol helps remove other forms of cholesterol from your bloodstream. Higher levels are better.'
  },
  'LDL Cholesterol': { 
    value: 128, 
    unit: 'mg/dL', 
    normalRange: '0-99', 
    status: 'elevated', 
    percentage: 54,
    description: 'LDL (bad) cholesterol can build up in your arteries, increasing your risk of heart disease and stroke.'
  },
  'Triglycerides': { 
    value: 180, 
    unit: 'mg/dL', 
    normalRange: '0-149', 
    status: 'elevated', 
    percentage: 60,
    description: 'Triglycerides are a type of fat in your blood. Elevated levels may increase your risk of heart disease.'
  }
};

// Helper function to determine trend based on biomarker status
const determineTrend = (status: BiomarkerStatus): 'up' | 'down' | 'stable' => {
  if (status === 'normal') {
    // Normal values are more likely to be stable
    const random = Math.random();
    if (random < 0.7) return 'stable';
    return random < 0.85 ? 'up' : 'down';
  } else if (status === 'elevated') {
    // Elevated values are more likely to show an upward trend
    return Math.random() < 0.7 ? 'up' : 'stable';
  } else if (status === 'low') {
    // Low values are more likely to show a downward trend
    return Math.random() < 0.7 ? 'down' : 'stable';
  } else if (status === 'critical') {
    // Critical values have different patterns
    return Math.random() < 0.5 ? 'up' : 'down';
  }
  
  return 'stable';
};

export const generateBiomarker = (): Biomarker => {
  // Create a new biomarker based on the file name to simulate processing results
  const biomarkerTypes = Object.keys(biomarkerValues);
  
  // Get a random biomarker type, ensuring we don't keep generating the same ones
  const randomIndex = Math.floor(Math.random() * biomarkerTypes.length);
  const biomarkerName = biomarkerTypes[randomIndex];
  
  const selectedBiomarker = biomarkerValues[biomarkerName];
  const trend = determineTrend(selectedBiomarker.status);

  // Create a unique ID using the biomarker name and timestamp
  const uniqueId = `bm-${biomarkerName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  return {
    id: uniqueId,
    name: biomarkerName,
    value: selectedBiomarker.value,
    unit: selectedBiomarker.unit,
    normalRange: selectedBiomarker.normalRange,
    status: selectedBiomarker.status,
    timestamp: new Date().toISOString(),
    percentage: selectedBiomarker.percentage,
    trend: trend,
    description: selectedBiomarker.description
  };
};
