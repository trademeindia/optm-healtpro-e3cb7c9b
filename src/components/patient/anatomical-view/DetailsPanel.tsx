
import React from 'react';
import { Hotspot } from './types';
import HotspotDetails from './HotspotDetails';

interface DetailsPanelProps {
  activeHotspotDetails: Hotspot | null;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ activeHotspotDetails }) => {
  if (!activeHotspotDetails) return null;
  
  return <HotspotDetails hotspot={activeHotspotDetails} />;
};

export default DetailsPanel;
