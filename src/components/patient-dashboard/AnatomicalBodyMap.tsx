
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HotspotMarker } from './anatomical-map';
import useAnatomicalMap from './anatomical-map/hooks/useAnatomicalMap';

// Optimize with memo to prevent unnecessary re-renders
const AnatomicalBodyMap: React.FC = memo(() => {
  const { 
    zoom, 
    isLoaded,
    selectedIssue, 
    healthIssues, 
    muscleFlexionData,
    handleZoomIn, 
    handleZoomOut, 
    handleIssueClick 
  } = useAnatomicalMap();
  
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
              src="/lovable-uploads/cc5c1cf4-bddf-4fc8-bc1a-6a1387ebbdf8.png" 
              alt="Human muscular anatomy" 
              className="anatomy-map-image"
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
        
        {/* Muscle group status indicators */}
        {muscleFlexionData && muscleFlexionData.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {muscleFlexionData.map((item) => (
              <div key={item.muscle} className="flex flex-col">
                <div className="text-xs font-medium">{item.muscle}</div>
                <div className="flex items-center gap-1.5">
                  <div 
                    className={`h-1 w-20 rounded-full ${
                      item.status === 'healthy' ? 'bg-green-500' : 
                      item.status === 'weak' ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                  ></div>
                  <span 
                    className={`text-xs ${
                      item.status === 'healthy' ? 'text-green-600' : 
                      item.status === 'weak' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}
                  >
                    {item.status === 'healthy' ? 'Healthy' : 
                     item.status === 'weak' ? 'Weak' : 
                     'Overworked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Selected issue details */}
        {selectedIssue && (
          <div className="mt-4 p-3 bg-muted/80 rounded-lg border">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{selectedIssue.name}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                selectedIssue.severity === 'high' ? 'bg-red-100 text-red-800' : 
                selectedIssue.severity === 'medium' ? 'bg-orange-100 text-orange-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {selectedIssue.severity === 'high' ? 'Severe' : 
                selectedIssue.severity === 'medium' ? 'Moderate' : 'Mild'}
              </span>
            </div>
            
            {selectedIssue.muscleGroup && (
              <div className="text-xs text-muted-foreground mt-1">
                Muscle Group: {selectedIssue.muscleGroup}
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-2">{selectedIssue.description}</p>
            
            {selectedIssue.symptoms && (
              <div className="mt-3">
                <span className="text-xs font-medium">Common Symptoms:</span>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {selectedIssue.symptoms.map((symptom, i) => (
                    <li key={i} className="text-xs">{symptom}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedIssue.recommendedActions && (
              <div className="mt-3">
                <span className="text-xs font-medium">Recommended Actions:</span>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {selectedIssue.recommendedActions.map((action, i) => (
                    <li key={i} className="text-xs">{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

AnatomicalBodyMap.displayName = 'AnatomicalBodyMap';

export default AnatomicalBodyMap;
