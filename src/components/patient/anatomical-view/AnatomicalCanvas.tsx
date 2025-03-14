
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { HumanModel, ViewControls, AutoRotate } from '.';

interface AnatomicalCanvasProps {
  activeSystem: string;
  isRotating: boolean;
  setIsRotating: (value: boolean) => void;
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
        className="w-full h-full"
        camera={{ position: cameraPosition, fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <HumanModel 
          activeSystem={activeSystem} 
          hotspots={hotspots} 
          onHotspotClick={handleHotspotClick}
          isEditMode={isEditMode}
        />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={!isRotating}
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
