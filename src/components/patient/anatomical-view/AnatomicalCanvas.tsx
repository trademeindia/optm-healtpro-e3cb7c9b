
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import HumanModel from './HumanModel';
import ViewControls from './ViewControls';
import AutoRotate from './AutoRotate';

interface AnatomicalCanvasProps {
  activeSystem: string;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  cameraPosition: [number, number, number];
  hotspots: any[];
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
    <div className="anatomy-canvas-container relative">
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        <Suspense fallback={null}>
          <HumanModel 
            activeSystem={activeSystem}
            hotspots={hotspots}
            onHotspotClick={handleHotspotClick}
            isEditMode={isEditMode}
          />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={!isEditMode}
          autoRotate={isRotating}
          autoRotateSpeed={1}
          maxDistance={7}
          minDistance={2.5}
        />
        
        <AutoRotate isRotating={isRotating} />
      </Canvas>
      
      <ViewControls
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetView={handleResetView}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
      />
    </div>
  );
};

export default AnatomicalCanvas;
