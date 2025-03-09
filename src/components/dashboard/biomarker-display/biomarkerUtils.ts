
// Helper functions for biomarker display and formatting

export interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'elevated' | 'low' | 'critical';
  timestamp: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  possibleCauses?: string[];
  recommendations?: string[];
}

export const getStatusColor = (status: 'normal' | 'elevated' | 'low' | 'critical') => {
  switch (status) {
    case 'normal':
      return 'text-green-500 stroke-green-500';
    case 'elevated':
      return 'text-yellow-500 stroke-yellow-500';
    case 'low':
      return 'text-blue-500 stroke-blue-500';
    case 'critical':
      return 'text-red-500 stroke-red-500';
    default:
      return 'text-green-500 stroke-green-500';
  }
};

export const getStatusBgColor = (status: 'normal' | 'elevated' | 'low' | 'critical') => {
  switch (status) {
    case 'normal':
      return 'bg-green-100 text-green-800';
    case 'elevated':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-green-100 text-green-800';
  }
};

export const getStatusDescription = (status: 'normal' | 'elevated' | 'low' | 'critical', biomarker: string) => {
  switch (status) {
    case 'normal':
      return `Your ${biomarker} levels are within the normal range, which is optimal for health.`;
    case 'elevated':
      return `Your ${biomarker} levels are higher than the normal range, which may require attention.`;
    case 'low':
      return `Your ${biomarker} levels are lower than the normal range, which may require attention.`;
    case 'critical':
      return `Your ${biomarker} levels are significantly outside the normal range and require immediate medical attention.`;
    default:
      return '';
  }
};

export const getTrendDescription = (trend?: 'up' | 'down' | 'stable', status?: 'normal' | 'elevated' | 'low' | 'critical') => {
  if (!trend || trend === 'stable') {
    return 'Your levels have been stable since your last measurement.';
  }
  
  if (trend === 'up') {
    if (status === 'low') {
      return 'Your levels are improving, moving toward the normal range.';
    } else if (status === 'elevated' || status === 'critical') {
      return 'Your levels are increasing, moving further from the normal range.';
    } else {
      return 'Your levels are rising, but still within normal range.';
    }
  } else { // down
    if (status === 'elevated' || status === 'critical') {
      return 'Your levels are improving, moving toward the normal range.';
    } else if (status === 'low') {
      return 'Your levels are decreasing, moving further from the normal range.';
    } else {
      return 'Your levels are declining, but still within normal range.';
    }
  }
};

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

export const getAffectedMuscles = (biomarkerName: string): string[] => {
  // Map biomarker names to potentially affected muscles
  const muscleMap: Record<string, string[]> = {
    'Hemoglobin': [
      'All skeletal muscles - reduced oxygen delivery',
      'Heart muscle (myocardium) - decreased oxygen supply',
      'Respiratory muscles (diaphragm, intercostals) - increased workload'
    ],
    'White Blood Cell Count': [
      'No direct muscle impact, but affects immune system function'
    ],
    'Glucose (Fasting)': [
      'All skeletal muscles - altered energy metabolism',
      'Heart muscle - metabolic changes',
      'Smooth muscles of blood vessels - potential vascular changes'
    ],
    'Total Cholesterol': [
      'Heart muscle - potential impaired function',
      'Smooth muscles of arteries - vascular effects'
    ],
    'HDL Cholesterol': [
      'Heart muscle - cardiovascular protection',
      'Arterial smooth muscle - vascular health'
    ],
    'LDL Cholesterol': [
      'Heart muscle - increased risk of atherosclerosis',
      'Arterial smooth muscle - plaque formation'
    ],
    'Vitamin D': [
      'All skeletal muscles - strength and function',
      'Postural muscles - stability and balance',
      'Proximal limb muscles (shoulders, hips) - particular vulnerability'
    ],
    'Cholesterol': [
      'Heart muscle - cardiovascular effects',
      'Arterial smooth muscle - vascular health'
    ],
    'Glucose': [
      'All skeletal muscles - energy metabolism',
      'Heart muscle - altered metabolism',
      'Smooth muscle of blood vessels'
    ],
    'Iron': [
      'All skeletal muscles - oxygen transport',
      'Respiratory muscles - endurance',
      'Heart muscle - oxygen utilization'
    ],
    'Hemoglobin A1C': [
      'Small blood vessels supplying muscles',
      'All skeletal muscles - glycation effects',
      'Heart muscle - metabolic changes'
    ],
    'Vitamin B12': [
      'All skeletal muscles - neurological function',
      'Muscles involved in fine motor control',
      'Muscles involved in balance and coordination'
    ],
    'Thyroid Stimulating Hormone': [
      'All skeletal muscles - metabolic rate',
      'Cardiac muscle - contractility and heart rate',
      'Respiratory muscles - breathing rate'
    ],
    'Ferritin': [
      'All muscle groups - oxygen transport',
      'Endurance muscles - fatigue resistance',
      'Heart muscle - cardiovascular function'
    ],
    'C-Reactive Protein': [
      'All skeletal muscles - inflammatory processes',
      'Cardiac muscle - inflammatory damage',
      'Smooth muscle - vascular inflammation'
    ],
    'Triglycerides': [
      'Heart muscle - potential lipid infiltration',
      'Skeletal muscles - altered energy metabolism'
    ],
    'Blood Pressure': [
      'Heart muscle - increased workload',
      'Arterial smooth muscle - structural changes',
      'Blood vessel walls - adaptation to pressure'
    ],
    'Vitamin B6': [
      'All skeletal muscles - protein metabolism',
      'Muscles involved in neurotransmitter function',
      'Muscles involved in hemoglobin synthesis'
    ]
  };

  // Return the muscles affected by the given biomarker, or an empty array if none found
  return muscleMap[biomarkerName] || [];
};
