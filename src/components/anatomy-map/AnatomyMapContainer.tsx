
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnatomyMap from './AnatomyMap';
import { getBodyRegions } from './data/bodyRegions';
import { SymptomHistoryContainer } from './symptom-history';
import { PainSymptom } from './types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const AnatomyMapContainer: React.FC = () => {
  const [symptoms, setSymptoms] = useState<PainSymptom[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Handle adding a new symptom
  const handleAddSymptom = (symptom: PainSymptom) => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const newSymptom = {
        ...symptom,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSymptoms(prev => [...prev, newSymptom]);
      setLoading(false);
      toast.success('Symptom added successfully');
    }, 500);
  };
  
  // Handle updating an existing symptom
  const handleUpdateSymptom = (updatedSymptom: PainSymptom) => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setSymptoms(prev => 
        prev.map(s => s.id === updatedSymptom.id ? {...updatedSymptom, updatedAt: new Date().toISOString()} : s)
      );
      setLoading(false);
      toast.success('Symptom updated successfully');
    }, 500);
  };
  
  // Handle deleting a symptom
  const handleDeleteSymptom = (symptomId: string) => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setSymptoms(prev => prev.filter(s => s.id !== symptomId));
      setLoading(false);
      toast.success('Symptom deleted successfully');
    }, 500);
  };
  
  // Handle toggling a symptom's active state
  const handleToggleActive = (symptomId: string, isActive: boolean) => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setSymptoms(prev => 
        prev.map(s => s.id === symptomId ? {...s, isActive, updatedAt: new Date().toISOString()} : s)
      );
      setLoading(false);
      toast.success(`Symptom ${isActive ? 'activated' : 'deactivated'} successfully`);
    }, 500);
  };
  
  return (
    <Card className="col-span-1 lg:col-span-2 h-full">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle>Anatomical Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <Tabs defaultValue="map" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 bg-muted/50 mx-4 mt-0 mb-3">
            <TabsTrigger value="map">Anatomy Map</TabsTrigger>
            <TabsTrigger value="history">Symptom History</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-auto">
            <TabsContent value="map" className="h-full m-0 p-4 pt-0">
              <AnatomyMap
                symptoms={symptoms}
                bodyRegions={getBodyRegions()}
                onAddSymptom={handleAddSymptom}
                onUpdateSymptom={handleUpdateSymptom}
                onDeleteSymptom={handleDeleteSymptom}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="history" className="h-full m-0 p-4 pt-0">
              <SymptomHistoryContainer 
                symptoms={symptoms}
                bodyRegions={getBodyRegions()}
                onUpdateSymptom={handleUpdateSymptom}
                onDeleteSymptom={handleDeleteSymptom}
                onToggleActive={handleToggleActive}
                loading={loading}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnatomyMapContainer;
