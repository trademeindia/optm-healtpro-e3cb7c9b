
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
