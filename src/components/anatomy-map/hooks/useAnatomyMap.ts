
import { useState, useEffect, useCallback } from 'react';
import { BodyRegion, PainSymptom } from '../types';
import { useSymptomSync } from '@/contexts/SymptomSyncContext';
import { toast } from 'sonner';

export const useAnatomyMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [symptoms, setSymptoms] = useState<PainSymptom[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<PainSymptom | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the symptom sync context for real-time updates
  const { trackRegionView, trackSymptomUpdate } = useSymptomSync();

  // Load symptoms from local storage on initial render
  useEffect(() => {
    try {
      const savedSymptoms = localStorage.getItem('patientSymptoms');
      console.log('Loading symptoms from localStorage:', savedSymptoms);
      
      if (savedSymptoms) {
        const parsedSymptoms = JSON.parse(savedSymptoms);
        console.log('Parsed symptoms:', parsedSymptoms);
        setSymptoms(parsedSymptoms);
      }
    } catch (error) {
      console.error('Error parsing saved symptoms:', error);
    }
  }, []);

  // Save symptoms to local storage whenever they change
  useEffect(() => {
    if (symptoms.length > 0) {
      console.log('Saving symptoms to localStorage:', symptoms);
      localStorage.setItem('patientSymptoms', JSON.stringify(symptoms));
    }
  }, [symptoms]);

  const handleRegionClick = useCallback((region: BodyRegion) => {
    console.log('Region clicked:', region);
    setSelectedRegion(region);
    
    // Track that this region was viewed
    trackRegionView(region);
    
    // Check if this region already has a symptom
    const existingSymptom = symptoms.find(
      s => s.bodyRegionId === region.id && s.isActive
    );
    
    if (existingSymptom) {
      console.log('Existing symptom found:', existingSymptom);
      setSelectedSymptom(existingSymptom);
      setIsDetailsDialogOpen(true);
    } else {
      console.log('No existing symptom, opening add dialog');
      setIsAddDialogOpen(true);
    }
  }, [symptoms, trackRegionView]);

  const handleAddSymptom = useCallback((data: Omit<PainSymptom, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    if (!selectedRegion) return;

    const now = new Date().toISOString();
    const newSymptom: PainSymptom = {
      id: `symptom-${Date.now()}`,
      bodyRegionId: selectedRegion.id,
      severity: data.severity,
      painType: data.painType,
      description: data.description,
      triggers: data.triggers,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    console.log('Adding new symptom:', newSymptom);
    setSymptoms(prev => [...prev, newSymptom]);
    setIsAddDialogOpen(false);
    setSelectedRegion(null);
    
    // Track this symptom update
    trackSymptomUpdate(newSymptom);
    
    toast.success(`Symptom added for ${selectedRegion.name}`, {
      description: "Your healthcare provider will be notified of this update."
    });
  }, [selectedRegion, trackSymptomUpdate]);

  const handleUpdateSymptom = useCallback((updatedSymptom: PainSymptom) => {
    console.log('Updating symptom:', updatedSymptom);
    setSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === updatedSymptom.id 
          ? { ...updatedSymptom, updatedAt: new Date().toISOString() } 
          : symptom
      )
    );
    setIsDetailsDialogOpen(false);
    setSelectedSymptom(null);
    
    // Track this symptom update
    trackSymptomUpdate({
      ...updatedSymptom,
      updatedAt: new Date().toISOString()
    });
    
    toast.success("Symptom updated", {
      description: "Your changes have been saved and synchronized."
    });
  }, [trackSymptomUpdate]);

  const handleDeleteSymptom = useCallback((symptomId: string) => {
    console.log('Deleting symptom:', symptomId);
    setSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === symptomId 
          ? { ...symptom, isActive: false, updatedAt: new Date().toISOString() } 
          : symptom
      )
    );
    setIsDetailsDialogOpen(false);
    setSelectedSymptom(null);
    
    toast.success("Symptom removed", {
      description: "This area will no longer show as symptomatic."
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    if (zoom < 1.5) setZoom(prev => Math.min(prev + 0.1, 1.5));
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    if (zoom > 0.6) setZoom(prev => Math.max(prev - 0.1, 0.6));
  }, [zoom]);

  const toggleHistory = useCallback(() => {
    console.log('Toggling history visibility');
    setShowHistory(prev => !prev);
  }, []);

  const handleRefresh = useCallback(() => {
    // Mock synchronization with doctor's dashboard
    console.log('Refreshing symptom data');
    toast.info("Synchronizing data...", { id: "sync" });
    
    setTimeout(() => {
      toast.success("Data synchronized", { 
        id: "sync",
        description: "Your symptom data is now up-to-date across all dashboards."
      });
    }, 1500);
  }, []);

  const handleToggleActive = useCallback((symptomId: string, isActive: boolean) => {
    console.log('Toggling symptom active state:', symptomId, isActive);
    setSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === symptomId 
          ? { ...symptom, isActive, updatedAt: new Date().toISOString() } 
          : symptom
      )
    );
    
    toast.success(isActive ? "Symptom activated" : "Symptom deactivated", {
      description: isActive ? "This area will now show as symptomatic." : "This area will no longer show as symptomatic."
    });
  }, []);

  // Filter for active symptoms only
  const activeSymptoms = symptoms.filter(s => s.isActive);

  return {
    selectedRegion,
    symptoms,
    activeSymptoms,
    isAddDialogOpen,
    isDetailsDialogOpen,
    selectedSymptom,
    zoom,
    showHistory,
    isLoading,
    handleRegionClick,
    handleAddSymptom,
    handleUpdateSymptom,
    handleDeleteSymptom,
    handleZoomIn,
    handleZoomOut,
    toggleHistory,
    handleRefresh,
    handleToggleActive,
    setIsAddDialogOpen,
    setIsDetailsDialogOpen,
    setSelectedRegion,
    setSelectedSymptom
  };
};

export default useAnatomyMap;
