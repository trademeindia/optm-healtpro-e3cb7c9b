
export const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'low': return 'bg-yellow-500';
    case 'medium': return 'bg-orange-500';
    case 'high': return 'bg-red-500';
    default: return 'bg-blue-500';
  }
};

export const getFlexionStatusColor = (status: 'healthy' | 'weak' | 'overworked') => {
  switch (status) {
    case 'healthy': return 'text-green-500';
    case 'weak': return 'text-orange-500';
    case 'overworked': return 'text-red-500';
    default: return 'text-blue-500';
  }
};

export const getFlexionProgressColor = (status: 'healthy' | 'weak' | 'overworked') => {
  switch (status) {
    case 'healthy': return 'bg-green-500';
    case 'weak': return 'bg-orange-500';
    case 'overworked': return 'bg-red-500';
    default: return 'bg-blue-500';
  }
};
