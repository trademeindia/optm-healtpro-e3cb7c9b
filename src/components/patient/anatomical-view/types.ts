
export interface Hotspot {
  id: string;
  position: [number, number, number];
  label: string;
  description: string;
  severity: string;
  color: string;
  size: number;
  region: string; // Added to sync with AnatomicalMap
}

export interface HumanModelProps {
  activeSystem: string;
  hotspots: Hotspot[];
  onHotspotClick: (id: string) => void;
}

export interface AnatomicalViewProps {
  selectedRegion?: string;
  onSelectRegion?: (region: string) => void;
  patientId?: number;
}

export interface BodySystem {
  id: string;
  label: string;
}

export interface AutoRotateProps {
  isRotating: boolean;
}

export interface HotspotProps {
  position: [number, number, number];
  color: string;
  size: number;
  label: string;
  description: string;
  severity: string;
  onClick: () => void;
}

export interface ModelImageProps {
  activeSystem: string;
}

export interface HotspotsGroupProps {
  hotspots: Hotspot[];
  onHotspotClick: (id: string) => void;
}
