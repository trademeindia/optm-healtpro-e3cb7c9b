
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnatomyMap from '../AnatomyMap';
import MapControls from './MapControls';
import { BodyRegion, PainSymptom } from '../types';

interface AnatomyMapCardProps {
  bodyRegions: BodyRegion[];
  symptoms: PainSymptom[];
  zoom: number;
  onRegionClick: (region: BodyRegion) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleHistory: () => void;
  onRefresh: () => void;
}

const AnatomyMapCard: React.FC<AnatomyMapCardProps> = ({
  bodyRegions,
  symptoms,
  zoom,
  onRegionClick,
  onZoomIn,
  onZoomOut,
  onToggleHistory,
  onRefresh
}) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Interactive Anatomy Map</CardTitle>
        <MapControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onToggleHistory={onToggleHistory}
          onRefresh={onRefresh}
        />
      </CardHeader>
      <CardContent>
        <AnatomyMap
          bodyRegions={bodyRegions}
          symptoms={symptoms}
          onRegionClick={onRegionClick}
          zoom={zoom}
        />
      </CardContent>
    </Card>
  );
};

export default AnatomyMapCard;
