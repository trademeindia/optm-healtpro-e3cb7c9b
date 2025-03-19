
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleAlert, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HealthIssue {
  id: string;
  name: string;
  location: { x: number; y: number };
  severity: 'low' | 'medium' | 'high';
  description: string;
}

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
  
  const handleZoomIn = () => {
    if (zoom < 1.5) setZoom(zoom + 0.1);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.7) setZoom(zoom - 0.1);
  };
  
  const handleIssueClick = (issue: HealthIssue) => {
    setSelectedIssue(issue === selectedIssue ? null : issue);
  };
  
  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Anatomical Analysis</CardTitle>
          <div className="flex items-center mt-1">
            <CircleAlert className="h-4 w-4 text-amber-500 mr-1.5" />
            <span className="text-sm text-muted-foreground">{healthIssues.length} issues detected</span>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div 
          className="relative w-full h-[400px] flex items-center justify-center overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <img 
            src="/lovable-uploads/6c831c22-d881-442c-88a6-7800492132b4.png" 
            alt="Muscular system anatomical model" 
            className="h-full max-h-[390px] w-auto object-contain"
          />
          
          <TooltipProvider>
            {healthIssues.map((issue) => (
              <Tooltip key={issue.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute w-5 h-5 rounded-full cursor-pointer ${getSeverityColor(issue.severity)} flex items-center justify-center border-2 border-white shadow-md ${selectedIssue?.id === issue.id ? 'w-7 h-7 z-10' : ''}`}
                    style={{
                      left: `${issue.location.x}%`,
                      top: `${issue.location.y}%`,
                      transform: 'translate(-50%, -50%)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => handleIssueClick(issue)}
                  >
                    <span className="text-white text-xs font-bold">{issue.id}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">{issue.name}</p>
                  <p className="text-xs">{issue.severity.toUpperCase()} severity</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        
        {selectedIssue && (
          <div className="absolute bottom-3 left-3 right-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{selectedIssue.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedIssue.description}</p>
              </div>
              <Badge className={`${getSeverityColor(selectedIssue.severity)} text-white`}>
                {selectedIssue.severity.toUpperCase()}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnatomicalBodyMap;
