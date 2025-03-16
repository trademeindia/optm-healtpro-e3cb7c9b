
import { ReactNode } from 'react';

export interface HotSpot {
  id: string;
  x: number;
  y: number;
  label: string;
  description?: string;
  severity: number;
  recommendations?: string[];
  relatedSymptoms?: string[];
}

export interface AnatomicalRegion {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface AnatomicalMapProps {
  className?: string;
}

export interface MapControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  className?: string;
}

export interface HotspotDetailProps {
  hotspot: HotSpot;
  onClose?: () => void;
}
