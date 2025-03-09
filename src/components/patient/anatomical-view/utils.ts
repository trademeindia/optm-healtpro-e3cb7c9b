
// Helper function to get position for hotspots based on body location
export const getHotspotPosition = (location: string): [number, number, number] => {
  // Map body locations to 3D positions
  const positionMap: Record<string, [number, number, number]> = {
    'head': [0, 1.0, 0],
    'neck': [0, 0.7, 0],
    'shoulder': [0.35, 0.5, 0],
    'shoulder-left': [0.35, 0.5, 0],
    'shoulder-right': [-0.35, 0.5, 0],
    'arm': [0.5, 0.3, 0],
    'arm-left': [0.5, 0.3, 0],
    'arm-right': [-0.5, 0.3, 0],
    'elbow': [0.55, 0.1, 0],
    'elbow-left': [0.55, 0.1, 0],
    'elbow-right': [-0.55, 0.1, 0],
    'wrist': [0.6, -0.1, 0],
    'wrist-left': [0.6, -0.1, 0],
    'wrist-right': [-0.6, -0.1, 0],
    'hand': [0.65, -0.2, 0],
    'hand-left': [0.65, -0.2, 0],
    'hand-right': [-0.65, -0.2, 0],
    'chest': [0, 0.3, 0],
    'back': [0, 0.3, -0.2],
    'abdomen': [0, 0, 0],
    'hip': [0.2, -0.2, 0],
    'hip-left': [0.2, -0.2, 0],
    'hip-right': [-0.2, -0.2, 0],
    'leg': [0.2, -0.5, 0],
    'leg-left': [0.2, -0.5, 0],
    'leg-right': [-0.2, -0.5, 0],
    'knee': [0.2, -0.7, 0],
    'knee-left': [0.2, -0.7, 0],
    'knee-right': [-0.2, -0.7, 0],
    'ankle': [0.2, -1.0, 0],
    'ankle-left': [0.2, -1.0, 0],
    'ankle-right': [-0.2, -1.0, 0],
    'foot': [0.2, -1.1, 0.1],
    'foot-left': [0.2, -1.1, 0.1],
    'foot-right': [-0.2, -1.1, 0.1],
    // Default position if no match
    'default': [0, 0, 0]
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
