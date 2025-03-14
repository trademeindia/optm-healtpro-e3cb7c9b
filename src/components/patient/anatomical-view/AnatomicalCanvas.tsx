
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import AutoRotate from './AutoRotate';
import HumanModel from './HumanModel';
import LoadingSpinner from './LoadingSpinner';
import { Hotspot } from './types';

interface AnatomicalCanvasProps {
  activeSystem: string;
  isRotating: boolean;
  setIsRotating: (rotating: boolean) => void;
  cameraPosition: [number, number, number];
  hotspots: Hotspot[];
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  handleHotspotClick: (id: string) => void;
  isEditMode?: boolean;
}

const AnatomicalCanvas: React.FC<AnatomicalCanvasProps> = ({
  activeSystem,
  isRotating,
  setIsRotating,
  cameraPosition,
  hotspots,
  handleZoomIn,
  handleZoomOut,
  handleResetView,
  handleHotspotClick,
  isEditMode = false
}) => {
  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: cameraPosition, fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={<LoadingSpinner />}>
          <HumanModel
            activeSystem={activeSystem}
            hotspots={hotspots}
            onHotspotClick={handleHotspotClick}
            isEditMode={isEditMode}
          />
        </Suspense>
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={isRotating}
          autoRotateSpeed={1}
          target={[0, 0, 0]}
        />
        <AutoRotate isRotating={isRotating} />
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setIsRotating(!isRotating)}
          className={isRotating ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
          title={isRotating ? "Stop Rotation" : "Start Rotation"}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleResetView}
          title="Reset View"
        >
          <span className="text-xs font-medium">Reset</span>
        </Button>
      </div>
      
      {/* Edit mode instructions */}
      {isEditMode && (
        <div className="absolute top-4 left-4 bg-yellow-100 dark:bg-yellow-900 p-2 rounded text-xs">
          <p className="font-semibold">Edit Mode</p>
          <p>Click on the model to add new hotspots</p>
        </div>
      )}
    </div>
  );
};

export default AnatomicalCanvas;
