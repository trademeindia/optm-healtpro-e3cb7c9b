
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Camera, Move, ArrowLeftRight, ArrowUpDown, Image, Ruler, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PostureAnalysisProps {
  className?: string;
}

const PostureAnalysis: React.FC<PostureAnalysisProps> = ({
  className
}) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  // Mock data for progress snapshots
  const progressSnapshots = [
    { id: 1, date: 'May 15, 2023', posture: 'Initial Assessment', improvement: '0%' },
    { id: 2, date: 'Jun 20, 2023', posture: 'First Follow-up', improvement: '12%' },
    { id: 3, date: 'Jul 25, 2023', posture: 'Second Follow-up', improvement: '27%' }
  ];
  
  return (
    <div className={cn("glass-morphism rounded-2xl p-4 md:p-6", className)}>
      <h3 className="text-lg font-semibold mb-2">Posture & Mobility Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Track posture metrics, range-of-motion, and view progress over time
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-2 h-24 p-2 bg-primary/5 hover:bg-primary/10"
              onClick={() => setSelectedFeature('posture')}
            >
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-xs text-center">Posture Scan</span>
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-2 h-24 p-2 bg-primary/5 hover:bg-primary/10"
              onClick={() => setSelectedFeature('mobility')}
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-2 h-24 p-2 bg-primary/5 hover:bg-primary/10"
              onClick={() => setSelectedFeature('progress')}
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
      </div>
      
      <div className="bg-muted/30 rounded-lg border border-border/50 p-4 text-center">
        <Scan className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <h4 className="font-medium mb-1">PosturePro™ Analysis</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Advanced posture and mobility tracking helps identify improvements and areas that need attention
        </p>
        <Button variant="outline" className="text-sm" disabled>
          View Detailed Analysis
        </Button>
      </div>
    </div>
  );
};

export default PostureAnalysis;
