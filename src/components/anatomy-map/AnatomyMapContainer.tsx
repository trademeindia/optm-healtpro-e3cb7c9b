
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PainSymptom } from './types';
import AnatomyMap from './AnatomyMap';
import SymptomHistoryTable from './SymptomHistoryTable';
import { getBodyRegions } from './data/bodyRegions';

const AnatomyMapContainer: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState<PainSymptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const bodyRegions = getBodyRegions();

  useEffect(() => {
    if (user) {
      fetchSymptoms();
    }
  }, [user]);

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use local storage as a temporary solution
      const storedSymptoms = localStorage.getItem(`symptoms_${user?.id}`);
      if (storedSymptoms) {
        setSymptoms(JSON.parse(storedSymptoms));
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      toast({
        title: 'Error loading symptoms',
        description: 'There was a problem loading your symptom data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSymptoms = async (updatedSymptoms: PainSymptom[]) => {
    try {
      // In a real implementation, this would save to Supabase
      // For now, we'll use local storage as a temporary solution
      localStorage.setItem(`symptoms_${user?.id}`, JSON.stringify(updatedSymptoms));
      setSymptoms(updatedSymptoms);
      toast({
        title: 'Symptoms updated',
        description: 'Your symptom information has been saved.',
      });
    } catch (error) {
      console.error('Error saving symptoms:', error);
      toast({
        title: 'Error saving symptoms',
        description: 'There was a problem saving your symptom data.',
        variant: 'destructive',
      });
    }
  };

  const handleAddSymptom = (newSymptom: PainSymptom) => {
    const updatedSymptoms = [...symptoms, newSymptom];
    saveSymptoms(updatedSymptoms);
  };

  const handleUpdateSymptom = (updatedSymptom: PainSymptom) => {
    const updatedSymptoms = symptoms.map(symptom => 
      symptom.id === updatedSymptom.id ? updatedSymptom : symptom
    );
    saveSymptoms(updatedSymptoms);
  };

  const handleDeleteSymptom = (symptomId: string) => {
    const updatedSymptoms = symptoms.filter(symptom => symptom.id !== symptomId);
    saveSymptoms(updatedSymptoms);
  };

  const handleToggleActive = (symptomId: string, isActive: boolean) => {
    const updatedSymptoms = symptoms.map(symptom => 
      symptom.id === symptomId ? { ...symptom, isActive } : symptom
    );
    saveSymptoms(updatedSymptoms);
  };

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Anatomy Map</TabsTrigger>
          <TabsTrigger value="history">Symptom History</TabsTrigger>
        </TabsList>
        
        <CardContent className="pt-6">
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
            <SymptomHistoryTable 
              symptoms={symptoms}
              bodyRegions={bodyRegions}
              onUpdateSymptom={handleUpdateSymptom}
              onDeleteSymptom={handleDeleteSymptom}
              onToggleActive={handleToggleActive}
              loading={loading}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default AnatomyMapContainer;
