
// Utility functions for the symptom tracker component

// Get the appropriate color based on pain level
export const getPainLevelColor = (level: number) => {
  if (level <= 3) return 'bg-medical-green text-white';
  if (level <= 6) return 'bg-medical-yellow text-white';
  return 'bg-medical-red text-white';
};

// Get the location label for display purposes
export const getLocationLabel = (locationValue: string, bodyRegions: any[]) => {
  const region = bodyRegions.find(r => r.value === locationValue);
  return region ? region.label : locationValue;
};
