
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Camera, Move, ArrowLeftRight, ArrowUpDown, Image, Ruler, Scan, CheckCircle, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface PostureAnalysisProps {
  className?: string;
}

const PostureAnalysis: React.FC<PostureAnalysisProps> = ({
  className
}) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posture');
  
  // Mock data for progress snapshots
  const progressSnapshots = [
    { id: 1, date: 'May 15, 2023', posture: 'Initial Assessment', improvement: '0%' },
    { id: 2, date: 'Jun 20, 2023', posture: 'First Follow-up', improvement: '12%' },
    { id: 3, date: 'Jul 25, 2023', posture: 'Second Follow-up', improvement: '27%' }
  ];

  // Mock posture analysis data
  const postureAnalysis = {
    overallScore: 68,
    areas: [
      { name: 'Head Alignment', score: 75, status: 'good', recommendation: 'Maintain current posture' },
      { name: 'Shoulder Balance', score: 62, status: 'moderate', recommendation: 'Try shoulder rolls and stretches' },
      { name: 'Spine Curvature', score: 58, status: 'moderate', recommendation: 'Focus on core strengthening' },
      { name: 'Hip Alignment', score: 77, status: 'good', recommendation: 'Continue hip-opening exercises' }
    ]
  };
  
  return (
    <div className={cn("glass-morphism rounded-2xl p-4 md:p-6", className)}>
      <h3 className="text-lg font-semibold mb-2">Posture & Mobility Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Track posture metrics, range-of-motion, and view progress over time
      </p>
      
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
        <Button 
          variant={activeTab === 'posture' ? "default" : "outline"} 
          size="sm"
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => setActiveTab('posture')}
        >
          <Camera className="h-4 w-4" />
          <span>Posture</span>
        </Button>
        <Button 
          variant={activeTab === 'mobility' ? "default" : "outline"} 
          size="sm"
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => setActiveTab('mobility')}
        >
          <Move className="h-4 w-4" />
          <span>Mobility</span>
        </Button>
        <Button 
          variant={activeTab === 'history' ? "default" : "outline"} 
          size="sm"
          className="flex items-center gap-1 whitespace-nowrap"
          onClick={() => setActiveTab('history')}
        >
          <Image className="h-4 w-4" />
          <span>History</span>
        </Button>
      </div>
      
      {activeTab === 'posture' && (
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 text-center border border-border/50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Your Posture Score</h4>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Last scan: Today</span>
            </div>
            
            <div className="relative pt-1 mb-3">
              <Progress value={postureAnalysis.overallScore} className="h-3 rounded-full bg-secondary/50" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Poor</span>
                <span className="text-xs text-muted-foreground">Excellent</span>
              </div>
            </div>
            
            <div className="bg-background/50 rounded-lg p-3 border border-border/40 mb-4">
              <div className="text-2xl font-bold">{postureAnalysis.overallScore}/100</div>
              <div className="text-xs text-muted-foreground">Your overall posture rating</div>
            </div>
            
            <div className="space-y-3">
              {postureAnalysis.areas.map((area, index) => (
                <div key={index} className="flex items-center justify-between bg-background/30 rounded-lg p-2.5 border border-border/20">
                  <div className="flex items-center gap-2">
                    {area.status === 'good' ? (
                      <CheckCircle className="w-4 h-4 text-medical-green" />
                    ) : area.status === 'moderate' ? (
                      <AlertTriangle className="w-4 h-4 text-medical-yellow" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-medical-red" />
                    )}
                    <div className="text-sm font-medium">{area.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{area.score}</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{area.recommendation}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-4" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Start New Posture Scan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Camera-based Posture Scan</DialogTitle>
                  <DialogDescription>
                    Use your device's camera to analyze posture metrics
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4 h-48 flex items-center justify-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Camera className="h-10 w-10 mb-2 opacity-50" />
                      <p className="text-sm text-center">Camera access required to perform posture scan</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded p-2 text-center">
                      <h4 className="text-sm font-medium">Knee Angle</h4>
                      <p className="text-xs text-muted-foreground">Stand sideways to measure</p>
                    </div>
                    <div className="border rounded p-2 text-center">
                      <h4 className="text-sm font-medium">Spinal Curvature</h4>
                      <p className="text-xs text-muted-foreground">Stand with back to camera</p>
                    </div>
                    <div className="border rounded p-2 text-center">
                      <h4 className="text-sm font-medium">Shoulder Alignment</h4>
                      <p className="text-xs text-muted-foreground">Stand facing camera</p>
                    </div>
                    <div className="border rounded p-2 text-center">
                      <h4 className="text-sm font-medium">Foot Alignment</h4>
                      <p className="text-xs text-muted-foreground">Stand on flat surface</p>
                    </div>
                  </div>
                  
                  <Button className="w-full" disabled>
                    Start Camera Scan
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Note: Camera access is required for this feature
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
      
      {activeTab === 'mobility' && (
        <div className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center gap-2 h-24 p-2 bg-primary/5 hover:bg-primary/10 w-full"
              >
                <Move className="h-6 w-6 text-primary" />
                <span className="text-xs text-center">Range-of-Motion Check</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Range-of-Motion Check</DialogTitle>
                <DialogDescription>
                  Follow guided tests to measure your mobility
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <h4 className="font-medium text-sm mb-1">Knee Flexion Test</h4>
                  <div className="flex gap-3 text-xs">
                    <div className="flex-1 p-2 bg-muted/20 rounded text-center">
                      <p>Supine</p>
                      <ArrowLeftRight className="mx-auto my-2 h-5 w-5 opacity-70" />
                      <p>0-135°</p>
                    </div>
                    <div className="flex-1 p-2 bg-muted/20 rounded text-center">
                      <p>Prone</p>
                      <ArrowLeftRight className="mx-auto my-2 h-5 w-5 opacity-70" />
                      <p>0-120°</p>
                    </div>
                    <div className="flex-1 p-2 bg-muted/20 rounded text-center">
                      <p>Standing</p>
                      <ArrowLeftRight className="mx-auto my-2 h-5 w-5 opacity-70" />
                      <p>0-90°</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-muted/50 p-4 h-36 flex items-center justify-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Ruler className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm text-center">Follow on-screen instructions to measure range of motion</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">Previous Test</Button>
                  <Button>Next Test</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Shoulder Flexion</h4>
              <div className="flex items-end justify-between">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">142°</div>
                  <div className="text-xs text-muted-foreground">Current</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">180°</div>
                  <div className="text-xs text-muted-foreground">Normal</div>
                </div>
              </div>
              <Progress value={78} className="h-2 mt-2" />
            </div>
            
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Hip Rotation</h4>
              <div className="flex items-end justify-between">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">32°</div>
                  <div className="text-xs text-muted-foreground">Current</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">45°</div>
                  <div className="text-xs text-muted-foreground">Normal</div>
                </div>
              </div>
              <Progress value={71} className="h-2 mt-2" />
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'history' && (
        <div className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center gap-2 h-24 p-2 bg-primary/5 hover:bg-primary/10 w-full"
              >
                <Image className="h-6 w-6 text-primary" />
                <span className="text-xs text-center">Progress Snapshots</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Progress Snapshots</DialogTitle>
                <DialogDescription>
                  Compare posture improvements over time
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1 rounded-lg bg-muted/50 p-2 h-32 flex items-center justify-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Image className="h-6 w-6 mb-1 opacity-50" />
                      <p className="text-xs text-center">Before</p>
                    </div>
                  </div>
                  <ArrowLeftRight className="h-6 w-6 opacity-70" />
                  <div className="flex-1 rounded-lg bg-muted/50 p-2 h-32 flex items-center justify-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Image className="h-6 w-6 mb-1 opacity-50" />
                      <p className="text-xs text-center">After</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Snapshot History</h4>
                  {progressSnapshots.map(snapshot => (
                    <div key={snapshot.id} className="flex justify-between items-center p-2 border rounded-lg text-sm">
                      <div>
                        <p className="font-medium">{snapshot.date}</p>
                        <p className="text-xs text-muted-foreground">{snapshot.posture}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-medium">{snapshot.improvement}</p>
                        <p className="text-xs text-muted-foreground">Improvement</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full">
                  Capture New Snapshot
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-3">
            <h4 className="font-medium">Posture Improvement Timeline</h4>
            
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-4 w-px bg-border/50"></div>
              {progressSnapshots.map((snapshot, index) => (
                <div key={snapshot.id} className="relative pl-12 pb-4">
                  <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-xs text-primary">{index + 1}</span>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/40">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-medium">{snapshot.posture}</h5>
                        <p className="text-xs text-muted-foreground">{snapshot.date}</p>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {snapshot.improvement}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full text-sm" size="sm">
              View Full History
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">Recommended Exercises</h4>
          <Button variant="link" size="sm" className="text-xs p-0 h-auto">View All</Button>
        </div>
        
        <div className="space-y-2">
          <div className="rounded-lg border p-3 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Move className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h5 className="text-sm font-medium">Scapular Retraction</h5>
                <p className="text-xs text-muted-foreground">Improves shoulder balance</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="rounded-lg border p-3 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <ArrowUpDown className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h5 className="text-sm font-medium">Child's Pose</h5>
                <p className="text-xs text-muted-foreground">Reduces spinal tension</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureAnalysis;

import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
