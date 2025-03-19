
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BodyPart } from './types';
import AnatomyMap from './AnatomyMap';
import { getBodyRegions } from './data/bodyRegions';
import { SymptomHistoryContainer } from './symptom-history';

const AnatomyMapContainer: React.FC = () => {
  const [activeBodyPart, setActiveBodyPart] = useState<BodyPart | null>(null);
  
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
                bodyRegions={getBodyRegions()}
                activeBodyPart={activeBodyPart}
                onSelectBodyPart={setActiveBodyPart}
              />
            </TabsContent>
            <TabsContent value="history" className="h-full m-0 p-4 pt-0">
              <SymptomHistoryContainer />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnatomyMapContainer;
