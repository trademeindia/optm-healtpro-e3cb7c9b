
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
  // Map biomarker names to potentially affected skeletal muscles only
  const muscleMap: Record<string, string[]> = {
    'Hemoglobin': [
      'Quadriceps',
      'Hamstrings',
      'Gastrocnemius (calves)',
      'Deltoids',
      'Respiratory muscles (diaphragm, intercostals)'
    ],
    'White Blood Cell Count': [
      'No direct skeletal muscle impact'
    ],
    'Glucose (Fasting)': [
      'Quadriceps',
      'Hamstrings',
      'Biceps',
      'Triceps',
      'Gluteal muscles'
    ],
    'Total Cholesterol': [
      'No direct skeletal muscle impact'
    ],
    'HDL Cholesterol': [
      'No direct skeletal muscle impact'
    ],
    'LDL Cholesterol': [
      'No direct skeletal muscle impact'
    ],
    'Vitamin D': [
      'Quadriceps',
      'Hamstrings',
      'Gluteal muscles',
      'Deltoids',
      'Trapezius',
      'Latissimus dorsi'
    ],
    'Cholesterol': [
      'No direct skeletal muscle impact'
    ],
    'Glucose': [
      'Quadriceps',
      'Hamstrings', 
      'Biceps',
      'Triceps', 
      'Gluteal muscles'
    ],
    'Iron': [
      'Quadriceps',
      'Hamstrings',
      'Deltoids',
      'Respiratory muscles (diaphragm, intercostals)'
    ],
    'Hemoglobin A1C': [
      'Quadriceps',
      'Hamstrings',
      'Biceps',
      'Triceps',
      'Foot muscles'
    ],
    'Vitamin B12': [
      'Quadriceps',
      'Gastrocnemius (calves)',
      'Forearm muscles',
      'Hand muscles',
      'Foot muscles'
    ],
    'Thyroid Stimulating Hormone': [
      'All skeletal muscles - affects metabolic rate',
      'Pectoralis major and minor',
      'Sternocleidomastoid',
      'Respiratory muscles (diaphragm, intercostals)'
    ],
    'Ferritin': [
      'Quadriceps',
      'Hamstrings',
      'Gastrocnemius (calves)',
      'Deltoids',
      'Latissimus dorsi'
    ],
    'C-Reactive Protein': [
      'Any skeletal muscle experiencing inflammation',
      'May include muscles involved in chronic exercise'
    ],
    'Triglycerides': [
      'Quadriceps',
      'Hamstrings',
      'Biceps',
      'Triceps'
    ],
    'Blood Pressure': [
      'No direct skeletal muscle impact'
    ],
    'Vitamin B6': [
      'All skeletal muscles involved in protein metabolism',
      'Particularly muscles undergoing growth or repair'
    ]
  };

  // Return the muscles affected by the given biomarker, or an empty array if none found
  return muscleMap[biomarkerName] || [];
};
