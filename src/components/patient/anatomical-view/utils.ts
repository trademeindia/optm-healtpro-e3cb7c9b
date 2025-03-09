
// Helper function to get position for hotspots based on body location
export const getHotspotPosition = (location: string): [number, number, number] => {
  // Map body locations to 3D positions - adjusted for better alignment with the model
  const positionMap: Record<string, [number, number, number]> = {
    'head': [0, 1.1, 0.1],
    'neck': [0, 0.8, 0.1],
    'shoulder': [0.35, 0.6, 0.1],
    'shoulder-left': [0.35, 0.6, 0.1],
    'shoulder-right': [-0.35, 0.6, 0.1],
    'arm': [0.5, 0.3, 0.1],
    'arm-left': [0.5, 0.3, 0.1],
    'arm-right': [-0.5, 0.3, 0.1],
    'elbow': [0.55, 0.1, 0.1],
    'elbow-left': [0.55, 0.1, 0.1],
    'elbow-right': [-0.55, 0.1, 0.1],
    'wrist': [0.6, -0.1, 0.1],
    'wrist-left': [0.6, -0.1, 0.1],
    'wrist-right': [-0.6, -0.1, 0.1],
    'hand': [0.65, -0.3, 0.1],
    'hand-left': [0.65, -0.3, 0.1],
    'hand-right': [-0.65, -0.3, 0.1],
    'chest': [0, 0.4, 0.1],
    'back': [0, 0.4, -0.2],
    'abdomen': [0, 0.1, 0.1],
    'hip': [0.2, -0.2, 0.1],
    'hip-left': [0.2, -0.2, 0.1],
    'hip-right': [-0.2, -0.2, 0.1],
    'leg': [0.2, -0.6, 0.1],
    'leg-left': [0.2, -0.6, 0.1],
    'leg-right': [-0.2, -0.6, 0.1],
    'knee': [0.2, -0.8, 0.1],
    'knee-left': [0.2, -0.8, 0.1],
    'knee-right': [-0.2, -0.8, 0.1],
    'ankle': [0.2, -1.1, 0.1],
    'ankle-left': [0.2, -1.1, 0.1],
    'ankle-right': [-0.2, -1.1, 0.1],
    'foot': [0.2, -1.2, 0.2],
    'foot-left': [0.2, -1.2, 0.2],
    'foot-right': [-0.2, -1.2, 0.2],
    // Default position if no match
    'default': [0, 0, 0.1]
  };

  return positionMap[location.toLowerCase()] || positionMap.default;
};

// Get color based on severity/pain level
export const getSeverityColor = (painLevel: number): string => {
  if (painLevel >= 7) return '#ff4d4f'; // red for high pain
  if (painLevel >= 4) return '#faad14'; // yellow for medium pain
  return '#52c41a'; // green for low pain
};

// Get severity text based on pain level
export const getSeverityLevel = (painLevel: number): string => {
  if (painLevel >= 7) return 'Severe';
  if (painLevel >= 4) return 'Moderate';
  return 'Mild';
};
