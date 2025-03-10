
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
    ],
    'Calcium': [
      'All skeletal muscles - affects muscle contraction',
      'Particularly important for postural muscles'
    ],
    'Magnesium': [
      'All skeletal muscles - essential for muscle function',
      'Respiratory muscles',
      'Postural muscles'
    ],
    'Potassium': [
      'All skeletal muscles - critical for muscle contraction',
      'Cardiac muscle (although not skeletal)'
    ],
    'Sodium': [
      'All skeletal muscles - important for nerve impulse transmission'
    ],
    'Creatine Kinase': [
      'Reflects damage in skeletal muscles',
      'Particularly elevated after intense exercise'
    ],
    'Albumin': [
      'No direct skeletal muscle impact, but affects protein availability'
    ],
    'Cortisol': [
      'Can affect all skeletal muscles through protein catabolism',
      'May lead to muscle wasting in chronic elevation'
    ],
    'Testosterone': [
      'All skeletal muscles - promotes muscle protein synthesis',
      'Particularly affects large muscle groups'
    ],
    'Vitamin K': [
      'No direct skeletal muscle impact'
    ],
    'Folate': [
      'No direct skeletal muscle impact'
    ],
    'Vitamin A': [
      'No direct skeletal muscle impact'
    ],
    'Vitamin E': [
      'May protect skeletal muscle from oxidative damage'
    ],
    'Zinc': [
      'All skeletal muscles - involved in protein synthesis',
      'Muscles undergoing growth or repair'
    ],
    'Copper': [
      'No direct skeletal muscle impact'
    ],
    'Selenium': [
      'May protect skeletal muscle from oxidative damage'
    ]
  };

  // Return the muscles affected by the given biomarker, or an empty array if none found
  return muscleMap[biomarkerName] || ['Information not available for this biomarker'];
};
