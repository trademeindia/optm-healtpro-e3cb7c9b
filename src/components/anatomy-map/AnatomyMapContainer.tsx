
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
import { useSymptoms } from '@/contexts/SymptomContext';
import { toast } from 'sonner';

const AnatomyMapContainer: React.FC = () => {
  const { user } = useAuth();
  const { addSymptom: updateGlobalSymptoms, loadPatientSymptoms } = useSymptoms();
  const [symptoms, setSymptoms] = useState<PainSymptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const bodyRegions = getBodyRegions();

  useEffect(() => {
    // Even without a user, let's initialize with empty symptoms
    fetchSymptoms();
  }, [user]);

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      if (user) {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use local storage as a temporary solution
        const storedSymptoms = localStorage.getItem(`symptoms_${user?.id}`);
        if (storedSymptoms) {
          const parsedSymptoms = JSON.parse(storedSymptoms);
          setSymptoms(parsedSymptoms);
          console.log("Fetched symptoms:", parsedSymptoms);
        }
      } else {
        console.log("No user found, using demo symptoms");
        // For demo purposes, we can still allow interaction
        const storedSymptoms = localStorage.getItem(`symptoms_demo`);
        if (storedSymptoms) {
          const parsedSymptoms = JSON.parse(storedSymptoms);
          setSymptoms(parsedSymptoms);
        }
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      toast.error('Error loading symptoms', {
        description: 'There was a problem loading your symptom data.'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSymptoms = async (updatedSymptoms: PainSymptom[]) => {
    try {
      // Storage key - use user ID if available, otherwise use 'demo'
      const storageKey = user?.id ? `symptoms_${user.id}` : 'symptoms_demo';
      
      // In a real implementation, this would save to Supabase
      // For now, we'll use local storage as a temporary solution
      localStorage.setItem(storageKey, JSON.stringify(updatedSymptoms));
      
      // Update the context data as well for global access
      if (user) {
        updatedSymptoms.forEach(symptom => {
          const symptomEntry = {
            id: symptom.id,
            date: new Date(symptom.createdAt),
            symptomName: symptom.painType,
            painLevel: symptom.severity === 'severe' ? 8 : symptom.severity === 'moderate' ? 5 : 2,
            location: bodyRegions.find(r => r.id === symptom.bodyRegionId)?.name || 'Unknown',
            notes: symptom.description,
            patientId: user?.id ? parseInt(user.id.substring(0, 5), 16) % 10 : 1 // Simple hash for demo
          };
          updateGlobalSymptoms(symptomEntry);
        });
        
        // Reload patient symptoms to update any dashboard components
        const patientId = parseInt(user.id.substring(0, 5), 16) % 10;
        loadPatientSymptoms(patientId);
      }
      
      setSymptoms(updatedSymptoms);
      toast.success('Symptoms updated', {
        description: 'Your symptom information has been saved.'
      });
    } catch (error) {
      console.error('Error saving symptoms:', error);
      toast.error('Error saving symptoms', {
        description: 'There was a problem saving your symptom data.'
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
    <Card className="w-full shadow-sm border border-gray-200 dark:border-gray-700">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 p-1">
          <TabsTrigger 
            value="map" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Anatomy Map
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Symptom History
          </TabsTrigger>
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
