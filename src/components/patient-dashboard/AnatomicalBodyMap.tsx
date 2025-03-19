
import React, { memo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoveHorizontal, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnatomicalData } from '@/contexts/AnatomicalDataContext';

// Optimize with memo to prevent unnecessary re-renders
const AnatomicalBodyMap: React.FC = memo(() => {
  const { 
    zoom, 
    setZoom,
    isLoaded,
    selectedIssue, 
    healthIssues, 
    handleIssueClick 
  } = useAnatomicalData();
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 1.5));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.7));
  };
  
  // Sync with symptom context when the component mounts
  useEffect(() => {
    if (isLoaded) {
      // This will be implemented in the AnatomicalDataContext
      // syncWithSymptoms();
    }
  }, [isLoaded]);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg">Anatomical View</CardTitle>
        <div className="flex items-center gap-1.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-4">
        <div className="anatomy-position-container">
          <div 
            className="anatomy-map-wrapper"
            style={{ transform: `scale(${zoom})` }}
          >
            <img 
              src="/lovable-uploads/f9cf0fb7-42a3-40b1-90b9-c7c2b44003a3.png" 
              alt="Human anatomy" 
              className="anatomy-map-image"
              onLoad={() => console.log('Anatomy image loaded')}
            />
            
            {isLoaded && healthIssues.map((issue) => (
              <HotspotMarker 
                key={issue.id}
                issue={issue}
                isSelected={selectedIssue?.id === issue.id}
                onClick={() => handleIssueClick(issue)}
              />
            ))}
          </div>
        </div>
        
        {selectedIssue && (
          <div className="mt-4 p-3 bg-muted/80 rounded-lg border">
            <h3 className="font-medium mb-1">{selectedIssue.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{selectedIssue.description}</p>
            
            <div className="text-sm">
              <span className="text-xs font-medium">Recommended:</span>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {selectedIssue.recommendedActions.map((action, i) => (
                  <li key={i} className="text-xs">{action}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Optimized HotspotMarker component using memo
const HotspotMarker = memo(({ 
  issue, 
  isSelected, 
  onClick 
}: { 
  issue: HealthIssue; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const { x, y } = issue.location;
  
  return (
    <div
      className={`hotspot-marker hotspot-size-md hotspot-severity-${issue.severity} ${isSelected ? 'hotspot-active hotspot-pulse' : ''}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
      }}
      onClick={onClick}
      role="button"
      aria-label={`${issue.name} hotspot`}
    >
      <MoveHorizontal className="hotspot-icon" size={16} />
      {isSelected && (
        <span className="hotspot-label">{issue.name}</span>
      )}
    </div>
  );
});

HotspotMarker.displayName = 'HotspotMarker';
AnatomicalBodyMap.displayName = 'AnatomicalBodyMap';

export default AnatomicalBodyMap;
