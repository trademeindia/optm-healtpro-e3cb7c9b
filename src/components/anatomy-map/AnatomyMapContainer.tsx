
import React, { useState, useEffect } from 'react';
import { useSymptoms } from '@/contexts/SymptomContext';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BodyRegion, PainSymptom, SymptomEntry } from './types';
import { Plus } from 'lucide-react';
import AnatomyMap from './AnatomyMap';
import SymptomDialog from './SymptomDialog';
import { painSeverityOptions, painTypeOptions } from './types';
import { SymptomHistoryContainer } from './symptom-history';
import { toast } from 'sonner';
import '@/styles/responsive/dialog.css';
import { v4 as uuidv4 } from 'uuid';

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
      { id: '1', name: 'Head', x: 50, y: 10, svgPathId: 'head' },
      { id: '2', name: 'Neck', x: 50, y: 18, svgPathId: 'neck' },
      { id: '3', name: 'Chest', x: 50, y: 30, svgPathId: 'chest' },
      { id: '4', name: 'Abdomen', x: 50, y: 42, svgPathId: 'abdomen' },
      { id: '5', name: 'Back', x: 25, y: 35, svgPathId: 'back' },
      { id: '6', name: 'Arms', x: 75, y: 35, svgPathId: 'arms' },
      { id: '7', name: 'Legs', x: 50, y: 65, svgPathId: 'legs' },
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

  // Convert symptom entry to pain symptom
  const convertToPainSymptom = (symptomEntry: SymptomEntry): PainSymptom => {
    return {
      id: symptomEntry.id,
      bodyRegionId: symptomEntry.location || '1',
      severity: convertPainLevelToSeverity(symptomEntry.painLevel || 5),
      painType: symptomEntry.symptomName || 'aching',
      description: symptomEntry.notes || '',
      triggers: [],
      createdAt: symptomEntry.date?.toISOString() || new Date().toISOString(),
      updatedAt: symptomEntry.date?.toISOString() || new Date().toISOString(),
      isActive: true,
    };
  };

  // Convert pain level number to severity string
  const convertPainLevelToSeverity = (painLevel: number): 'mild' | 'moderate' | 'severe' => {
    if (painLevel <= 3) return 'mild';
    if (painLevel <= 6) return 'moderate';
    return 'severe';
  };

  // Convert pain symptoms to context symptom entries
  const convertToSymptomEntry = (painSymptom: PainSymptom): SymptomEntry => {
    return {
      id: painSymptom.id,
      date: new Date(painSymptom.createdAt),
      symptomName: painSymptom.painType,
      painLevel: convertSeverityToPainLevel(painSymptom.severity),
      location: painSymptom.bodyRegionId,
      notes: painSymptom.description || '', // Ensure notes is always a string
    };
  };

  // Convert severity to pain level number
  const convertSeverityToPainLevel = (severity: 'mild' | 'moderate' | 'severe'): number => {
    switch (severity) {
      case 'mild': return 3;
      case 'moderate': return 5;
      case 'severe': return 8;
      default: return 5;
    }
  };

  const handleAddSymptom = async (symptom: PainSymptom) => {
    setLoading(true);
    try {
      // Convert PainSymptom to SymptomEntry for context
      const symptomEntry = convertToSymptomEntry(symptom);
      addSymptom(symptomEntry);
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
      // Convert PainSymptom to SymptomEntry for context
      const symptomEntry = convertToSymptomEntry(symptom);
      updateSymptom(symptom.id, symptomEntry);
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

  const handleToggleActive = (symptomId: string, isActive: boolean) => {
    const symptom = convertedSymptoms.find(s => s.id === symptomId);
    if (symptom) {
      const symptomEntry = convertToSymptomEntry(symptom);
      symptomEntry.painLevel = isActive ? convertSeverityToPainLevel(symptom.severity) : 0;
      updateSymptom(symptomId, symptomEntry);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Convert symptom entries to pain symptoms
  const convertedSymptoms: PainSymptom[] = symptoms.map(symptom => 
    convertToPainSymptom(symptom)
  );

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
            bodyRegions={bodyRegions}
            symptoms={convertedSymptoms}
            onAddSymptom={handleAddSymptom}
            onUpdateSymptom={handleUpdateSymptom}
            onDeleteSymptom={handleDeleteSymptom}
            loading={loading}
            onRegionClick={handleRegionClick}
            selectedRegions={selectedRegion ? [selectedRegion] : []}
          />
        </div>
        <div>
          <SymptomHistoryContainer 
            symptoms={convertedSymptoms}
            onEditSymptom={handleEditSymptom}
            bodyRegions={bodyRegions}
            onUpdateSymptom={handleUpdateSymptom}
            onDeleteSymptom={handleDeleteSymptom}
            onToggleActive={handleToggleActive}
            loading={loading}
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
        existingSymptoms={convertedSymptoms.filter(s => selectedRegion ? s.bodyRegionId === selectedRegion.id : false)}
        onAddSymptom={handleAddSymptom}
        onUpdateSymptom={handleUpdateSymptom}
        onDeleteSymptom={handleDeleteSymptom}
        loading={loading}
      />
    </div>
  );
};

export default AnatomyMapContainer;
