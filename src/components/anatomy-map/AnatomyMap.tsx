
import React, { useState } from 'react';
import { BodyRegion, PainSymptom } from './types';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import BodyRegionMarker from './BodyRegionMarker';
import SymptomDialog from './SymptomDialog';

interface AnatomyMapProps {
  symptoms: PainSymptom[];
  bodyRegions: BodyRegion[];
  onAddSymptom: (symptom: PainSymptom) => void;
  onUpdateSymptom: (symptom: PainSymptom) => void;
  onDeleteSymptom: (symptomId: string) => void;
  loading: boolean;
}

const AnatomyMap: React.FC<AnatomyMapProps> = ({
  symptoms,
  bodyRegions,
  onAddSymptom,
  onUpdateSymptom,
  onDeleteSymptom,
  loading
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<PainSymptom | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(region);
    
    // Check if there's an active symptom for this region
    const existingSymptom = symptoms.find(
      s => s.bodyRegionId === region.id && s.isActive
    );
    
    if (existingSymptom) {
      setSelectedSymptom(existingSymptom);
      setIsEditMode(true);
    } else {
      setSelectedSymptom(null);
      setIsEditMode(false);
    }
    
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRegion(null);
    setSelectedSymptom(null);
  };

  const getActiveSymptomForRegion = (regionId: string): PainSymptom | undefined => {
    return symptoms.find(symptom => symptom.bodyRegionId === regionId && symptom.isActive);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Interactive Anatomy Map</h2>
          <p className="text-sm text-muted-foreground">
            Click on a body region to add or update your symptoms
          </p>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm" onClick={handleZoomIn} className="h-9 w-9 p-0">
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut} className="h-9 w-9 p-0">
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom} className="h-9 w-9 p-0">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Reset zoom</span>
          </Button>
        </div>
      </div>
      
      <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] bg-muted/20 rounded-lg flex items-center justify-center overflow-hidden border shadow-sm">
        <div 
          className="relative flex items-center justify-center"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.3s ease-out',
            height: '100%',
            width: '100%',
          }}
        >
          {/* Anatomy model image */}
          <img 
            src="/lovable-uploads/6c831c22-d881-442c-88a6-7800492132b4.png" 
            alt="Human anatomy model" 
            className="max-h-[90%] max-w-[90%] object-contain"
          />
          
          {/* Map region markers */}
          {bodyRegions.map(region => (
            <BodyRegionMarker
              key={region.id}
              region={region}
              symptom={getActiveSymptomForRegion(region.id)}
              onClick={() => handleRegionClick(region)}
            />
          ))}
        </div>
      </div>
      
      {/* Symptom entry/edit dialog */}
      <SymptomDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        selectedRegion={selectedRegion}
        existingSymptom={selectedSymptom}
        isEditMode={isEditMode}
        onAdd={onAddSymptom}
        onUpdate={onUpdateSymptom}
        onDelete={onDeleteSymptom}
      />
    </div>
  );
};

export default AnatomyMap;
