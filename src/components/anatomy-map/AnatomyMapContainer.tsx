
import React, { useState, useCallback, memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnatomyMap from './AnatomyMap';
import { getBodyRegions } from './data/bodyRegions';
import { SymptomHistoryContainer } from './symptom-history';
import { PainSymptom } from './types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Memoize the component to prevent unnecessary re-renders
const AnatomyMapContainer: React.FC = memo(() => {
  const [symptoms, setSymptoms] = useState<PainSymptom[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  
  // Handle adding a new symptom with useCallback to prevent recreation on every render
  const handleAddSymptom = useCallback((symptom: PainSymptom) => {
    setLoading(true);
    // Use a shorter timeout to improve responsiveness
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
    }, 300);
  }, []);
  
  // Handle updating an existing symptom with useCallback
  const handleUpdateSymptom = useCallback((updatedSymptom: PainSymptom) => {
    setLoading(true);
    setTimeout(() => {
      setSymptoms(prev => 
        prev.map(s => s.id === updatedSymptom.id ? {...updatedSymptom, updatedAt: new Date().toISOString()} : s)
      );
      setLoading(false);
      toast.success('Symptom updated successfully');
    }, 300);
  }, []);
  
  // Handle deleting a symptom with useCallback
  const handleDeleteSymptom = useCallback((symptomId: string) => {
    setLoading(true);
    setTimeout(() => {
      setSymptoms(prev => prev.filter(s => s.id !== symptomId));
      setLoading(false);
      toast.success('Symptom deleted successfully');
    }, 300);
  }, []);
  
  // Handle toggling a symptom's active state with useCallback
  const handleToggleActive = useCallback((symptomId: string, isActive: boolean) => {
    setLoading(true);
    setTimeout(() => {
      setSymptoms(prev => 
        prev.map(s => s.id === symptomId ? {...s, isActive, updatedAt: new Date().toISOString()} : s)
      );
      setLoading(false);
      toast.success(`Symptom ${isActive ? 'activated' : 'deactivated'} successfully`);
    }, 300);
  }, []);

  // Memoize the body regions to prevent re-calculation on every render
  const bodyRegions = React.useMemo(() => getBodyRegions(), []);
  
  return (
    <Card className="col-span-1 lg:col-span-2 h-full">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle>Anatomical Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <Tabs 
          defaultValue="map" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid grid-cols-2 bg-muted/50 mx-4 mt-0 mb-3">
            <TabsTrigger value="map">Anatomy Map</TabsTrigger>
            <TabsTrigger value="history">Symptom History</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-auto">
            <TabsContent value="map" className="h-full m-0 p-4 pt-0">
              <AnatomyMap
                symptoms={symptoms}
                bodyRegions={bodyRegions}
                onAddSymptom={handleAddSymptom}
                onUpdateSymptom={handleUpdateSymptom}
                onDeleteSymptom={handleDeleteSymptom}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="history" className="h-full m-0 p-4 pt-0">
              <SymptomHistoryContainer 
                symptoms={symptoms}
                bodyRegions={bodyRegions}
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
});

// Add display name for better debugging
AnatomyMapContainer.displayName = 'AnatomyMapContainer';

export default AnatomyMapContainer;
