
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnatomicalMapping, Biomarker } from '@/types/medicalData';
import SystemTabs from '@/components/patient/anatomical-map/SystemTabs';
import { Map, AlertCircle } from 'lucide-react';

interface AnatomicalViewerProps {
  mappings: AnatomicalMapping[];
  biomarkers: Biomarker[];
}

const AnatomicalViewer: React.FC<AnatomicalViewerProps> = ({ mappings, biomarkers }) => {
  const [activeSystem, setActiveSystem] = React.useState('full-body');
  
  // Group mappings by body system
  const systemMappings = {
    'full-body': mappings,
    'muscular': mappings.filter(m => isMusculoskeletal(m.bodyPart)),
    'skeletal': mappings.filter(m => isSkeletal(m.bodyPart)),
    'organs': mappings.filter(m => isOrgan(m.bodyPart)),
    'vascular': mappings.filter(m => isVascular(m.bodyPart)),
    'nervous': mappings.filter(m => isNervous(m.bodyPart)),
    'skin': mappings.filter(m => isSkin(m.bodyPart)),
  };
  
  const currentMappings = systemMappings[activeSystem as keyof typeof systemMappings];
  
  if (mappings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <Map className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Anatomical Data</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Upload medical reports or enter biomarker data to see anatomical mappings here.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Anatomical Mapping</h2>
      
      <Card>
        <CardContent className="p-4">
          <SystemTabs activeSystem={activeSystem} onSystemChange={setActiveSystem} />
          
          <div className="mt-6 border rounded-lg p-4 min-h-[400px] relative">
            {/* This would be a visualization of the human body with hotspots */}
            <div className="flex justify-center items-center h-full">
              <div className="bg-muted/20 border rounded-lg p-6 w-80 relative">
                <HumanBodyOutline />
                
                {/* Render hotspots */}
                {currentMappings.map((mapping, index) => (
                  <Hotspot 
                    key={index}
                    mapping={mapping}
                    biomarkers={biomarkers.filter(b => mapping.affectedBiomarkers.includes(b.id))}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {currentMappings.map((mapping, index) => (
          <MappingCard 
            key={index} 
            mapping={mapping} 
            biomarkers={biomarkers.filter(b => mapping.affectedBiomarkers.includes(b.id))}
          />
        ))}
      </div>
    </div>
  );
};

// Simple human body outline component
const HumanBodyOutline: React.FC = () => (
  <div className="h-80 w-full flex justify-center">
    <svg viewBox="0 0 100 200" className="h-full">
      {/* Simple human body outline */}
      <circle cx="50" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="1" /> {/* Head */}
      <line x1="50" y1="40" x2="50" y2="120" stroke="currentColor" strokeWidth="1" /> {/* Torso */}
      <line x1="50" y1="60" x2="20" y2="90" stroke="currentColor" strokeWidth="1" /> {/* Left arm */}
      <line x1="50" y1="60" x2="80" y2="90" stroke="currentColor" strokeWidth="1" /> {/* Right arm */}
      <line x1="50" y1="120" x2="30" y2="180" stroke="currentColor" strokeWidth="1" /> {/* Left leg */}
      <line x1="50" y1="120" x2="70" y2="180" stroke="currentColor" strokeWidth="1" /> {/* Right leg */}
    </svg>
  </div>
);

// Hotspot component
interface HotspotProps {
  mapping: AnatomicalMapping;
  biomarkers: Biomarker[];
}

const Hotspot: React.FC<HotspotProps> = ({ mapping, biomarkers }) => {
  const { x, y } = mapping.coordinates;
  
  // Determine color based on severity
  const getColor = (severity: number) => {
    if (severity >= 8) return 'bg-red-500';
    if (severity >= 5) return 'bg-amber-500';
    return 'bg-yellow-400';
  };
  
  // Determine size based on number of biomarkers
  const getSize = (biomarkerCount: number) => {
    if (biomarkerCount >= 3) return 'h-4 w-4';
    if (biomarkerCount >= 2) return 'h-3 w-3';
    return 'h-2 w-2';
  };
  
  return (
    <div 
      className={`absolute rounded-full animate-pulse ${getColor(mapping.severity)} ${getSize(biomarkers.length)}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      title={mapping.bodyPart}
    />
  );
};

// Mapping info card
interface MappingCardProps {
  mapping: AnatomicalMapping;
  biomarkers: Biomarker[];
}

const MappingCard: React.FC<MappingCardProps> = ({ mapping, biomarkers }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base capitalize">{mapping.bodyPart}</CardTitle>
            <CardDescription>
              {mapping.affectedBiomarkers.length} related biomarker{mapping.affectedBiomarkers.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <div className={`
            p-1 rounded-full 
            ${mapping.severity >= 8 ? 'bg-red-100 text-red-600' : 
              mapping.severity >= 5 ? 'bg-amber-100 text-amber-600' : 
              'bg-yellow-100 text-yellow-600'}
          `}>
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Severity:</span> {mapping.severity}/10
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Related biomarkers:</span>
            <ul className="mt-1 space-y-1 pl-4 text-xs">
              {biomarkers.map(biomarker => (
                <li key={biomarker.id}>
                  {biomarker.name}: <span className={`${
                    biomarker.latestValue.status === 'normal' ? 'text-green-600' :
                    biomarker.latestValue.status === 'critical' ? 'text-red-600' :
                    'text-amber-600'
                  }`}>
                    {biomarker.latestValue.value} {biomarker.latestValue.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {mapping.notes && (
            <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
              {mapping.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions to categorize body parts
function isMusculoskeletal(bodyPart: string): boolean {
  const muscularParts = ['muscle', 'tendon', 'ligament'];
  return muscularParts.some(part => bodyPart.toLowerCase().includes(part));
}

function isSkeletal(bodyPart: string): boolean {
  const skeletalParts = ['bone', 'joint', 'spine', 'skull', 'rib'];
  return skeletalParts.some(part => bodyPart.toLowerCase().includes(part));
}

function isOrgan(bodyPart: string): boolean {
  const organParts = ['heart', 'liver', 'kidney', 'lung', 'pancreas', 'thyroid', 'brain'];
  return organParts.some(part => bodyPart.toLowerCase().includes(part));
}

function isVascular(bodyPart: string): boolean {
  const vascularParts = ['blood', 'vessel', 'artery', 'vein'];
  return vascularParts.some(part => bodyPart.toLowerCase().includes(part));
}

function isNervous(bodyPart: string): boolean {
  const nervousParts = ['nerve', 'brain', 'spinal'];
  return nervousParts.some(part => bodyPart.toLowerCase().includes(part));
}

function isSkin(bodyPart: string): boolean {
  const skinParts = ['skin', 'dermal'];
  return skinParts.some(part => bodyPart.toLowerCase().includes(part));
}

export default AnatomicalViewer;
