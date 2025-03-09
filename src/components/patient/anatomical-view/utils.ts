
export const getHotspotPosition = (location: string): [number, number, number] => {
  const positionMap: Record<string, [number, number, number]> = {
    head: [0, 1.7, 0.3],
    neck: [0, 1.4, 0.2],
    rightShoulder: [-0.8, 1.2, 0.3],
    leftShoulder: [0.8, 1.2, 0.3],
    chest: [0, 0.8, 0.4],
    rightElbow: [-1.2, 0.5, 0.3],
    leftElbow: [1.2, 0.5, 0.3],
    abdomen: [0, 0.2, 0.3],
    lowerBack: [0, 0.2, -0.3],
    rightHip: [-0.5, -0.3, 0.2],
    leftHip: [0.5, -0.3, 0.2],
    rightKnee: [-0.3, -1.0, 0.3],
    leftKnee: [0.3, -1.0, 0.3],
    rightAnkle: [-0.3, -1.7, 0.3],
    leftAnkle: [0.3, -1.7, 0.3],
  };
  
  return positionMap[location] || [0, 0, 0];
};

export const getSeverityColor = (painLevel: number): string => {
  if (painLevel <= 3) return '#4CAF50';
  if (painLevel <= 6) return '#FF9800';
  return '#F44336';
};

export const getSeverityLevel = (painLevel: number): 'low' | 'medium' | 'high' => {
  if (painLevel <= 3) return 'low';
  if (painLevel <= 6) return 'medium';
  return 'high';
};

export const BODY_SYSTEMS = [
  { id: 'full', label: 'Full body' },
  { id: 'skin', label: 'Skin' },
  { id: 'muscular', label: 'Muscular' },
  { id: 'skeletal', label: 'Skeletal' },
  { id: 'organs', label: 'Organs' },
  { id: 'vascular', label: 'Vascular' },
  { id: 'nervous', label: 'Nervous' },
  { id: 'lymphatic', label: 'Lymphatic' }
];
