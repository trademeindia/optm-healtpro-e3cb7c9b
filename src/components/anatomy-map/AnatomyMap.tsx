
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left w-full md:w-auto">
          <h2 className="text-xl font-semibold mb-1">Interactive Anatomy Map</h2>
          <p className="text-sm text-muted-foreground">
            Click on a body region to add or update your symptoms
          </p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-9 w-9">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-9 w-9">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetZoom} className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative w-full h-[450px] sm:h-[500px] md:h-[600px] bg-gray-50 dark:bg-gray-800/20 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
        <div 
          className="relative flex items-center justify-center"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {/* Anatomy model image */}
          <img 
            src="/lovable-uploads/c541481d-746e-4a06-8bd1-b31681d83a5a.png" 
            alt="Human anatomy model" 
            className="max-h-[430px] sm:max-h-[480px] md:max-h-[580px] w-auto object-contain"
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
