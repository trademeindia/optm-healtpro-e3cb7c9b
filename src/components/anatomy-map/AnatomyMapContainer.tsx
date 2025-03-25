
import React, { useState, useEffect } from 'react';
import { useSymptoms } from '@/contexts/SymptomContext';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BodyRegion, PainSymptom } from './types';
import { Plus } from 'lucide-react';
import AnatomyMap from './AnatomyMap';
import SymptomDialog from './SymptomDialog';
import { painSeverityOptions, painTypeOptions } from './types';
import { SymptomHistoryContainer } from './symptom-history';
import { toast } from 'sonner';
import '@/styles/responsive/dialog.css';

const AnatomyMapContainer: React.FC = () => {
  const { symptoms, addSymptom, updateSymptom, deleteSymptom } = useSymptoms();
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<PainSymptom | null>(null);
  const [loading, setLoading] = useState(false);
  const [bodyRegions, setBodyRegions] = useState<BodyRegion[]>([]);
  
  // Simulating fetch of body regions
  useEffect(() => {
    // This would be a call to your API in a real application
    const fetchedRegions: BodyRegion[] = [
      { id: '1', name: 'Head', svgPathId: 'head' },
      { id: '2', name: 'Neck', svgPathId: 'neck' },
      { id: '3', name: 'Chest', svgPathId: 'chest' },
      { id: '4', name: 'Abdomen', svgPathId: 'abdomen' },
      { id: '5', name: 'Back', svgPathId: 'back' },
      { id: '6', name: 'Arms', svgPathId: 'arms' },
      { id: '7', name: 'Legs', svgPathId: 'legs' },
    ];
    setBodyRegions(fetchedRegions);
  }, []);

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(region);
    setIsEditMode(false);
    setSelectedSymptom(null);
    setIsDialogOpen(true);
  };

  const handleEditSymptom = (symptom: PainSymptom) => {
    const region = bodyRegions.find(r => r.id === symptom.bodyRegionId);
    if (region) {
      setSelectedRegion(region);
      setSelectedSymptom(symptom);
      setIsEditMode(true);
      setIsDialogOpen(true);
    }
  };

  const handleAddSymptom = async (symptom: PainSymptom) => {
    setLoading(true);
    try {
      addSymptom(symptom);
      toast.success(`Pain symptom added for ${selectedRegion?.name}`);
    } catch (error) {
      toast.error('Failed to add symptom');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSymptom = async (symptom: PainSymptom) => {
    setLoading(true);
    try {
      updateSymptom(symptom);
      toast.success('Symptom updated successfully');
    } catch (error) {
      toast.error('Failed to update symptom');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSymptom = async (symptomId: string) => {
    setLoading(true);
    try {
      deleteSymptom(symptomId);
      toast.success('Symptom deleted successfully');
    } catch (error) {
      toast.error('Failed to delete symptom');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button 
          variant="outline" 
          className="border-dashed flex items-center gap-2 bg-muted/50"
          onClick={() => {
            if (bodyRegions.length > 0) {
              handleRegionClick(bodyRegions[0]);
            }
          }}
        >
          <Plus size={16} />
          Add New Symptom
        </Button>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AnatomyMap 
            onRegionClick={handleRegionClick} 
            selectedRegions={symptoms.map(s => s.bodyRegionId)}
          />
        </div>
        <div>
          <SymptomHistoryContainer 
            symptoms={symptoms} 
            onEditSymptom={handleEditSymptom}
            regions={bodyRegions}
          />
        </div>
      </div>
      
      <SymptomDialog
        open={isDialogOpen}
        onClose={closeDialog}
        selectedRegion={selectedRegion}
        existingSymptom={selectedSymptom}
        isEditMode={isEditMode}
        bodyRegions={bodyRegions}
        existingSymptoms={symptoms}
        onAddSymptom={handleAddSymptom}
        onUpdateSymptom={handleUpdateSymptom}
        onDeleteSymptom={handleDeleteSymptom}
        loading={loading}
      />
    </div>
  );
};

export default AnatomyMapContainer;
