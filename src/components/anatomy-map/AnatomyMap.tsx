
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserRound } from 'lucide-react';
import BodyRegionMarker from './BodyRegionMarker';
import { BodyRegion, PainSymptom } from './types'; 
import { useSymptomSync } from '@/contexts/SymptomSyncContext';

interface AnatomyMapProps {
  bodyRegions: BodyRegion[];
  symptoms: PainSymptom[];
  onRegionClick: (region: BodyRegion) => void;
  zoom: number;
}

const AnatomyMap: React.FC<AnatomyMapProps> = ({ 
  bodyRegions, 
  symptoms, 
  onRegionClick,
  zoom 
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const { trackRegionView } = useSymptomSync();
  
  // Filter regions based on current view
  const frontRegions = bodyRegions.filter(region => 
    !region.id.includes('back-') && !region.id.includes('-back')
  );
  
  const backRegions = bodyRegions.filter(region => 
    region.id.includes('back-') || region.id.includes('-back')
  );
  
  // Function to find symptom for a body region
  const findSymptomForRegion = (regionId: string) => {
    return symptoms.find(symptom => symptom.bodyRegionId === regionId);
  };
  
  const handleRegionClick = (region: BodyRegion) => {
    // Track view in real time system
    trackRegionView(region);
    
    // Call parent handler
    onRegionClick(region);
  };
  
  return (
    <div className="w-full">
      <Tabs 
        defaultValue="front" 
        className="w-full" 
        onValueChange={(value) => setView(value as 'front' | 'back')}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="front" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Front View
            </TabsTrigger>
            <TabsTrigger value="back" className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              Back View
            </TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            {symptoms.length} active {symptoms.length === 1 ? 'symptom' : 'symptoms'}
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
          <TabsContent value="front" className="mt-0">
            <div 
              className="relative h-[600px] w-full flex justify-center"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-out'
              }}
            >
              {/* Anatomy front view image */}
              <img 
                src="/lovable-uploads/49a33513-51a5-4cbb-b210-a6308cfa91bf.png" 
                alt="Human anatomy front view" 
                className="h-full max-h-[600px] w-auto object-contain"
              />
              
              {/* Front view hotspots */}
              {frontRegions.map(region => (
                <BodyRegionMarker
                  key={region.id}
                  region={region}
                  symptom={findSymptomForRegion(region.id)}
                  onClick={() => handleRegionClick(region)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="back" className="mt-0">
            <div 
              className="relative h-[600px] w-full flex justify-center"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-out'
              }}
            >
              {/* Anatomy back view image */}
              <img 
                src="/lovable-uploads/5a2de827-6408-43ae-91c8-4bfd13c1ed17.png" 
                alt="Human anatomy back view" 
                className="h-full max-h-[600px] w-auto object-contain"
              />
              
              {/* Back view hotspots */}
              {backRegions.map(region => (
                <BodyRegionMarker
                  key={region.id}
                  region={region}
                  symptom={findSymptomForRegion(region.id)}
                  onClick={() => handleRegionClick(region)}
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AnatomyMap;
