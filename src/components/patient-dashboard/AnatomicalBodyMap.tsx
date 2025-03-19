
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HeaderControls from './anatomical-map/HeaderControls';
import HotspotMarker from './anatomical-map/HotspotMarker';
import IssueDetailPanel from './anatomical-map/IssueDetailPanel';
import MuscleFlexionPanel from './anatomical-map/MuscleFlexionPanel';
import { HealthIssue, MuscleFlexion } from './anatomical-map/types';

const AnatomicalBodyMap: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<HealthIssue | null>(null);
  
  const healthIssues: HealthIssue[] = [
    {
      id: '1',
      name: 'Rotator Cuff Tear',
      location: { x: 42, y: 21 },
      severity: 'medium',
      description: 'Partial tear in the right rotator cuff showing inflammation and reduced strength.'
    },
    {
      id: '2',
      name: 'Lower Back Strain',
      location: { x: 49, y: 49 },
      severity: 'high',
      description: 'Muscle strain in the erector spinae muscles, causing restricted movement and acute pain.'
    },
    {
      id: '3',
      name: 'Quadriceps Tendinitis',
      location: { x: 45, y: 75 },
      severity: 'low',
      description: 'Mild inflammation of the quadriceps tendon with some discomfort during extension.'
    },
    {
      id: '4',
      name: 'Biceps Tendonitis',
      location: { x: 36, y: 33 },
      severity: 'medium',
      description: 'Inflammation in the long head of the biceps tendon causing pain during flexion.'
    }
  ];
  
  const muscleFlexionData: MuscleFlexion[] = [
    {
      muscle: 'Rotator Cuff',
      flexionPercentage: 45,
      status: 'weak',
      lastReading: '2 hours ago'
    },
    {
      muscle: 'Erector Spinae',
      flexionPercentage: 30,
      status: 'overworked',
      lastReading: '2 hours ago'
    },
    {
      muscle: 'Quadriceps',
      flexionPercentage: 65,
      status: 'weak',
      lastReading: '2 hours ago'
    },
    {
      muscle: 'Biceps',
      flexionPercentage: 72,
      status: 'healthy',
      lastReading: '2 hours ago'
    }
  ];
  
  const handleZoomIn = () => {
    if (zoom < 1.5) setZoom(zoom + 0.1);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.7) setZoom(zoom - 0.1);
  };
  
  const handleIssueClick = (issue: HealthIssue) => {
    setSelectedIssue(issue === selectedIssue ? null : issue);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Anatomical Analysis</CardTitle>
        <HeaderControls 
          issuesCount={healthIssues.length}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </CardHeader>
      <CardContent className="relative">
        <div 
          className="relative w-full h-[350px] flex items-center justify-center overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <img 
            src="/lovable-uploads/6c831c22-d881-442c-88a6-7800492132b4.png" 
            alt="Muscular system anatomical model" 
            className="h-full max-h-[340px] w-auto object-contain"
          />
          
          {healthIssues.map((issue) => (
            <HotspotMarker
              key={issue.id}
              issue={issue}
              isSelected={selectedIssue?.id === issue.id}
              onClick={handleIssueClick}
            />
          ))}
        </div>
        
        <MuscleFlexionPanel flexionData={muscleFlexionData} />
        
        {selectedIssue && <IssueDetailPanel issue={selectedIssue} />}
      </CardContent>
    </Card>
  );
};

export default AnatomicalBodyMap;
