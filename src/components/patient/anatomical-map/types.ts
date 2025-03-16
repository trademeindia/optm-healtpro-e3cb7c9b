
import { SymptomEntry } from '@/contexts/SymptomContext';

export interface AnatomicalRegion {
  id: string;
  name: string;
  // Coordinates represent the percentage position on the image
  x: number;
  y: number;
}

export interface HotSpot {
  id: string;
  region: string; // Corresponds to keys in anatomicalRegions
  size: number;
  color: string;
  label: string;
  description: string;
}

export interface HotspotMarkerProps {
  hotspot: HotSpot;
  isActive: boolean;
  onClick: (hotspot: HotSpot) => void;
}

export interface HotspotDetailProps {
  hotspot: HotSpot;
}

export interface MapControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export interface AnatomicalMapProps {
  className?: string;
}
