
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeaderControls, HotspotMarker, IssueDetailPanel, MuscleFlexionPanel, useAnatomicalMap } from './anatomical-map';

const AnatomicalBodyMap: React.FC = () => {
  const {
    zoom,
    selectedIssue,
    healthIssues,
    muscleFlexionData,
    handleZoomIn,
    handleZoomOut,
    handleIssueClick
  } = useAnatomicalMap();
  
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
          className="relative w-full h-[350px] flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800/20 rounded-md"
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <div className="anatomy-position-container relative h-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/6c831c22-d881-442c-88a6-7800492132b4.png" 
              alt="Muscular system anatomical model" 
              className="h-full max-h-[340px] w-auto object-contain"
              onLoad={() => setImageLoaded(true)}
            />
            
            {imageLoaded && healthIssues.map((issue) => (
              <HotspotMarker
                key={issue.id}
                issue={issue}
                isSelected={selectedIssue?.id === issue.id}
                onClick={handleIssueClick}
              />
            ))}
          </div>
        </div>
        
        <MuscleFlexionPanel 
          flexionData={muscleFlexionData} 
          healthIssues={healthIssues}
        />
        
        {selectedIssue && <IssueDetailPanel issue={selectedIssue} />}
      </CardContent>
    </Card>
  );
};

export default AnatomicalBodyMap;
