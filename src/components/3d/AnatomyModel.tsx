
import React, { useState, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface AnatomyModelProps {
  className?: string;
  image?: string; // Kept for backward compatibility
  modelUrl?: string;
  hotspots: Hotspot[];
}

// Human model for interactive hotspots
const HumanModel = ({ hotspots, onHotspotClick, activeHotspot }: { 
  hotspots: Hotspot[]; 
  onHotspotClick: (id: string) => void; 
  activeHotspot: string | null;
}) => {
  // Using a transparent group to place hotspots
  const group = useRef<THREE.Group>(null);
  
  // Add slight automatic rotation
  useFrame(() => {
    if (group.current) {
      // Subtle automatic rotation when not interacting
      group.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Add 3D hotspots */}
      {hotspots.map((hotspot) => (
        <group key={hotspot.id} position={[hotspot.x / 25 - 2, hotspot.y / 25 - 2, hotspot.z / 50]}>
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              onHotspotClick(hotspot.id);
            }}
            scale={activeHotspot === hotspot.id ? 1.2 : 1}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial 
              color={hotspot.color} 
              emissive={hotspot.color} 
              emissiveIntensity={activeHotspot === hotspot.id ? 0.8 : 0.4} 
            />
          </mesh>
          <Html
            position={[0.2, 0.2, 0]}
            style={{
              display: activeHotspot === hotspot.id ? 'block' : 'none',
              width: '150px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              pointerEvents: 'none',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{hotspot.label}</h3>
            <p style={{ fontSize: '12px' }}>{hotspot.description}</p>
          </Html>
        </group>
      ))}
    </group>
  );
};

// Controls for camera positioning
const CameraControls = ({ zoom, setZoom }: { zoom: number; setZoom: (zoom: number) => void }) => {
  const { camera } = useThree();
  
  // Update camera position when zoom changes
  React.useEffect(() => {
    camera.position.z = 10 - zoom * 5;
  }, [zoom, camera]);
  
  return <OrbitControls 
    enablePan={true} 
    enableZoom={true} 
    enableRotate={true}
    minDistance={3}
    maxDistance={15}
  />;
};

// Main component
const AnatomyModel: React.FC<AnatomyModelProps> = ({
  className,
  image,
  modelUrl,
  hotspots,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(0.5);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Add 3D position to hotspots
  const enhancedHotspots = hotspots.map(hotspot => ({
    ...hotspot,
    z: hotspot.z || 0 // Default z value if not provided
  }));

  const handleHotspotClick = (id: string) => {
    setActiveHotspot(id === activeHotspot ? null : id);
  };

  const rotateModel = (direction: 'left' | 'right') => {
    const amount = direction === 'left' ? -30 : 30;
    setRotation(prev => prev + amount);
  };
  
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      if (direction === 'in' && prev < 1) return prev + 0.1;
      if (direction === 'out' && prev > 0) return prev - 0.1;
      return prev;
    });
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div 
      className={cn(
        "anatomy-model-container relative",
        fullscreen ? "fixed inset-0 z-50 bg-background/90 backdrop-blur-sm" : "h-full", 
        className
      )}
    >
      <motion.div
        className="relative w-full h-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-2 right-2 z-20">
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          {/* Background image - displayed behind the Canvas */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90 z-0"
            style={{ 
              backgroundImage: "url('/lovable-uploads/15366aea-43a6-4d71-a42f-52ce619d37e3.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          />
          
          {/* 3D Canvas with transparent background */}
          <Canvas 
            className="w-full h-full z-10" 
            style={{ background: 'transparent', position: 'relative' }}
            camera={{ position: [0, 0, 8], fov: 50 }}
            dpr={[1, 2]}
          >
            {/* Fix: Use an actual color value instead of 'transparent' */}
            <color attach="background" args={[0, 0, 0, 0]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
              <HumanModel 
                hotspots={enhancedHotspots} 
                onHotspotClick={handleHotspotClick} 
                activeHotspot={activeHotspot} 
              />
              <CameraControls zoom={zoom} setZoom={setZoom} />
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <Button 
            onClick={() => rotateModel('left')}
            variant="secondary"
            className="p-1 md:p-2 rounded-full glass-morphism h-8 w-8 md:h-10 md:w-10 flex items-center justify-center"
            aria-label="Rotate left"
          >
            <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button 
            onClick={() => rotateModel('right')}
            variant="secondary"
            className="p-1 md:p-2 rounded-full glass-morphism h-8 w-8 md:h-10 md:w-10 flex items-center justify-center"
            aria-label="Rotate right"
          >
            <RotateCw className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button 
            onClick={() => handleZoom('in')}
            variant="secondary"
            className="p-1 md:p-2 rounded-full glass-morphism h-8 w-8 md:h-10 md:w-10 flex items-center justify-center"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button 
            onClick={() => handleZoom('out')}
            variant="secondary"
            className="p-1 md:p-2 rounded-full glass-morphism h-8 w-8 md:h-10 md:w-10 flex items-center justify-center"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnatomyModel;
