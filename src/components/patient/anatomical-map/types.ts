
import { SymptomEntry } from '@/contexts/SymptomContext';

export interface AnatomicalRegion {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface HotSpot {
  id: string;
  region: string;
  size: number;
  color: string;
  label: string;
  description: string;
}

export interface AnatomicalMapProps {
  className?: string;
}

export interface HotspotMarkerProps {
  hotspot: HotSpot;
  isActive: boolean;
  onClick: (hotspot: HotSpot) => void;
  position: { x: number; y: number };
}

export interface AnatomicalRegionsData {
  [key: string]: AnatomicalRegion;
}

export interface MapControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export interface HotspotDetailProps {
  hotspot: HotSpot | null;
  anatomicalRegions: AnatomicalRegionsData;
}
