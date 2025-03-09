
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import HumanModel from './HumanModel';
import AutoRotate from './AutoRotate';
import ViewControls from './ViewControls';
import { Hotspot } from './types';

interface AnatomicalCanvasProps {
  activeSystem: string;
  isRotating: boolean;
  setIsRotating: (value: boolean) => void;
  cameraPosition: [number, number, number];
  hotspots: Hotspot[];
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  handleHotspotClick: (id: string) => void;
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
  handleHotspotClick
}) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center" style={{ minHeight: '700px' }}>
      <Canvas 
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 3], fov: 30 }} // Increased FOV for wider view
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={cameraPosition} />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={true}
            enableRotate={!isRotating}
            minDistance={1.5}
            maxDistance={8}
            minPolarAngle={Math.PI / 6} // Limit how far user can orbit vertically
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
          <HumanModel 
            activeSystem={activeSystem} 
            hotspots={hotspots}
            onHotspotClick={handleHotspotClick}
          />
          <AutoRotate isRotating={isRotating} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      <ViewControls 
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetView={handleResetView}
      />
    </div>
  );
};

export default AnatomicalCanvas;
