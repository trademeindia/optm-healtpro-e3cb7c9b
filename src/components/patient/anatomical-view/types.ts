
export interface Hotspot {
  id: string;
  position: [number, number, number];
  label: string;
  description: string;
  severity: string;
  color: string;
  size: number;
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
