
export const useActivityData = (fitnessData: any) => {
  const activityData = [
    { day: 'Mon', value: 8500 },
    { day: 'Tue', value: 9200 },
    { day: 'Wed', value: 7800 },
    { day: 'Thu', value: 8100 },
    { day: 'Fri', value: 10200 },
    { day: 'Sat', value: 6500 },
    { day: 'Sun', value: 7300 }
  ];

  const getSteps = () => {
    return fitnessData.steps ? {
      data: activityData,
      currentValue: Number(fitnessData.steps.value),
      source: fitnessData.steps.source,
      lastSync: new Date(fitnessData.steps.timestamp).toLocaleTimeString()
    } : { data: activityData, currentValue: 8152 };
  };

  return getSteps();
};
