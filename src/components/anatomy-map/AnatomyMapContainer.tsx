
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, History, RefreshCw } from 'lucide-react';
import AnatomyMap from './AnatomyMap';
import SymptomDialog from './SymptomDialog';
import SymptomDetailsDialog from './SymptomDetailsDialog';
import SymptomHistoryTable from './SymptomHistoryTable';
import { getBodyRegions } from './data/bodyRegions';
import { BodyRegion, PainSymptom, painSeverityOptions, painTypeOptions } from './types';
import { useSymptomSync } from '@/contexts/SymptomSyncContext';
import { toast } from 'sonner';

const AnatomyMapContainer: React.FC = () => {
  const [bodyRegions] = useState<BodyRegion[]>(getBodyRegions());
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [symptoms, setSymptoms] = useState<PainSymptom[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<PainSymptom | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  
  // Use the symptom sync context for real-time updates
  const { trackRegionView, trackSymptomUpdate } = useSymptomSync();

  // Load symptoms from local storage on initial render
  useEffect(() => {
    const savedSymptoms = localStorage.getItem('patientSymptoms');
    if (savedSymptoms) {
      try {
        setSymptoms(JSON.parse(savedSymptoms));
      } catch (error) {
        console.error('Error parsing saved symptoms:', error);
      }
    }
  }, []);

  // Save symptoms to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('patientSymptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(region);
    
    // Track that this region was viewed
    trackRegionView(region);
    
    // Check if this region already has a symptom
    const existingSymptom = symptoms.find(
      s => s.bodyRegionId === region.id && s.isActive
    );
    
    if (existingSymptom) {
      setSelectedSymptom(existingSymptom);
      setIsDetailsDialogOpen(true);
    } else {
      setIsAddDialogOpen(true);
    }
  };

  const handleAddSymptom = (data: Omit<PainSymptom, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
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

    setSymptoms(prev => [...prev, newSymptom]);
    setIsAddDialogOpen(false);
    setSelectedRegion(null);
    
    // Track this symptom update
    trackSymptomUpdate(newSymptom);
    
    toast.success(`Symptom added for ${selectedRegion.name}`, {
      description: "Your healthcare provider will be notified of this update."
    });
  };

  const handleUpdateSymptom = (updatedSymptom: PainSymptom) => {
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
  };

  const handleDeleteSymptom = (symptomId: string) => {
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
  };

  const handleZoomIn = () => {
    if (zoom < 1.5) setZoom(prev => prev + 0.1);
  };

  const handleZoomOut = () => {
    if (zoom > 0.6) setZoom(prev => prev - 0.1);
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const handleRefresh = () => {
    // Mock synchronization with doctor's dashboard
    toast.info("Synchronizing data...", { id: "sync" });
    
    setTimeout(() => {
      toast.success("Data synchronized", { 
        id: "sync",
        description: "Your symptom data is now up-to-date across all dashboards."
      });
    }, 1500);
  };

  // Filter for active symptoms only
  const activeSymptoms = symptoms.filter(s => s.isActive);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Interactive Anatomy Map</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleHistory} title="View symptom history">
              <History className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRefresh} title="Sync data">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnatomyMap
            bodyRegions={bodyRegions}
            symptoms={activeSymptoms}
            onRegionClick={handleRegionClick}
            zoom={zoom}
          />
        </CardContent>
      </Card>

      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Symptom History</CardTitle>
          </CardHeader>
          <CardContent>
            <SymptomHistoryTable symptoms={symptoms} bodyRegions={bodyRegions} />
          </CardContent>
        </Card>
      )}

      <SymptomDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setSelectedRegion(null);
        }}
        onSubmit={handleAddSymptom}
        bodyRegion={selectedRegion}
        painSeverityOptions={painSeverityOptions}
        painTypeOptions={painTypeOptions}
      />

      <SymptomDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedSymptom(null);
        }}
        symptom={selectedSymptom}
        bodyRegion={selectedRegion}
        painSeverityOptions={painSeverityOptions}
        painTypeOptions={painTypeOptions}
        onUpdate={handleUpdateSymptom}
        onDelete={handleDeleteSymptom}
      />
    </div>
  );
};

export default AnatomyMapContainer;
