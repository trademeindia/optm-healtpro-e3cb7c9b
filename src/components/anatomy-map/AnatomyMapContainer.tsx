
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnatomyMap from './AnatomyMap';
import { v4 as uuidv4 } from 'uuid';
import { bodyRegions } from './data/bodyRegions';
import { BodyRegion, PainSymptom } from './types';
import { toast } from 'sonner';
import { SymptomHistoryContainer } from './symptom-history';

const AnatomyMapContainer: React.FC = () => {
  const [symptoms, setSymptoms] = useState<PainSymptom[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('map');

  // Simulate loading symptoms from an API
  useEffect(() => {
    const loadSymptoms = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use localStorage for persistence
        const savedSymptoms = localStorage.getItem('painSymptoms');
        if (savedSymptoms) {
          setSymptoms(JSON.parse(savedSymptoms));
        }
      } catch (error) {
        console.error('Failed to load symptoms:', error);
        toast.error('Failed to load your symptom history');
      } finally {
        setLoading(false);
      }
    };

    loadSymptoms();
  }, []);

  // Save symptoms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('painSymptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  const handleAddSymptom = (symptom: PainSymptom) => {
    const newSymptom = {
      ...symptom,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSymptoms(prev => {
      // Deactivate any existing active symptoms for this body region
      const updated = prev.map(s => 
        s.bodyRegionId === symptom.bodyRegionId && s.isActive 
          ? { ...s, isActive: false, updatedAt: new Date().toISOString() } 
          : s
      );
      
      return [newSymptom, ...updated];
    });
    
    toast.success(`Added symptom for ${bodyRegions.find(r => r.id === symptom.bodyRegionId)?.name}`);
  };

  const handleUpdateSymptom = (updatedSymptom: PainSymptom) => {
    setSymptoms(prev => prev.map(s => 
      s.id === updatedSymptom.id 
        ? { ...updatedSymptom, updatedAt: new Date().toISOString() } 
        : s
    ));
    
    toast.success(`Updated symptom for ${bodyRegions.find(r => r.id === updatedSymptom.bodyRegionId)?.name}`);
  };

  const handleDeleteSymptom = (symptomId: string) => {
    const symptomToDelete = symptoms.find(s => s.id === symptomId);
    if (!symptomToDelete) return;
    
    setSymptoms(prev => prev.filter(s => s.id !== symptomId));
    
    toast.success(`Removed symptom for ${bodyRegions.find(r => r.id === symptomToDelete.bodyRegionId)?.name}`);
  };

  const handleToggleActive = (symptomId: string, isActive: boolean) => {
    const symptomToToggle = symptoms.find(s => s.id === symptomId);
    if (!symptomToToggle) return;
    
    setSymptoms(prev => {
      // If we're activating a symptom, deactivate other symptoms for the same region
      if (isActive) {
        return prev.map(s => 
          s.id === symptomId 
            ? { ...s, isActive, updatedAt: new Date().toISOString() }
            : (s.bodyRegionId === symptomToToggle.bodyRegionId && s.isActive)
              ? { ...s, isActive: false, updatedAt: new Date().toISOString() }
              : s
        );
      } 
      // Simply toggle the requested symptom
      else {
        return prev.map(s => 
          s.id === symptomId 
            ? { ...s, isActive, updatedAt: new Date().toISOString() } 
            : s
        );
      }
    });
    
    const action = isActive ? 'Activated' : 'Deactivated';
    toast.success(`${action} symptom for ${bodyRegions.find(r => r.id === symptomToToggle.bodyRegionId)?.name}`);
  };

  return (
    <div className="w-full space-y-4">
      <Tabs 
        defaultValue="map" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="anatomy-tabs"
      >
        <TabsList className="mb-4 w-full grid grid-cols-2 md:w-auto">
          <TabsTrigger 
            value="map" 
            className={`anatomy-tab ${activeTab === 'map' ? 'anatomy-tab-active' : ''}`}
          >
            Anatomy Map
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className={`anatomy-tab ${activeTab === 'history' ? 'anatomy-tab-active' : ''}`}
          >
            Symptom History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-0">
          <AnatomyMap 
            symptoms={symptoms}
            bodyRegions={bodyRegions}
            onAddSymptom={handleAddSymptom}
            onUpdateSymptom={handleUpdateSymptom}
            onDeleteSymptom={handleDeleteSymptom}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <SymptomHistoryContainer
            symptoms={symptoms}
            bodyRegions={bodyRegions}
            onUpdateSymptom={handleUpdateSymptom}
            onDeleteSymptom={handleDeleteSymptom}
            onToggleActive={handleToggleActive}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnatomyMapContainer;
