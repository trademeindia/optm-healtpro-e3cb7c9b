
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
