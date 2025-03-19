
import React, { useEffect, useState } from 'react';
import { BodyRegion, PainSymptom } from './types';
import BodyRegionMarker from './BodyRegionMarker';
import { Spinner } from '@/components/ui/spinner';

interface AnatomyMapProps {
  bodyRegions: BodyRegion[];
  symptoms: PainSymptom[];
  onRegionClick: (region: BodyRegion) => void;
  zoom: number;
}

const AnatomyMap: React.FC<AnatomyMapProps> = ({
  bodyRegions,
  symptoms,
  onRegionClick,
  zoom
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  // Handle image load to set dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageHeight(img.offsetHeight);
    setImageWidth(img.offsetWidth);
    setIsLoading(false);
    console.log(`Anatomy map image loaded: ${img.offsetWidth}x${img.offsetHeight}`);
  };

  useEffect(() => {
    console.log('AnatomyMap symptoms:', symptoms);
  }, [symptoms]);

  return (
    <div className="relative w-full flex justify-center items-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden min-h-[500px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="lg" />
          <span className="ml-3 text-muted-foreground">Loading anatomy map...</span>
        </div>
      )}
      
      <div 
        className="relative w-full h-full flex justify-center items-center transition-transform p-4"
        style={{ transform: `scale(${zoom})` }}
      >
        <img
          src="/lovable-uploads/a6f71747-46dd-486d-97a5-2e263119b969.png"
          alt="Human body diagram"
          className="max-h-[500px] object-contain"
          onLoad={handleImageLoad}
        />
        
        {!isLoading && 
          bodyRegions.map((region) => {
            const hasSymptom = symptoms.some(s => s.bodyRegionId === region.id);
            return (
              <BodyRegionMarker
                key={region.id}
                region={region}
                hasSymptom={hasSymptom}
                onClick={() => onRegionClick(region)}
              />
            );
          })
        }
      </div>
    </div>
  );
};

export default AnatomyMap;
