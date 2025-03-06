
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

// Fallback human model using Three.js primitives
const HumanModel = ({ hotspots, onHotspotClick, activeHotspot }: { 
  hotspots: Hotspot[]; 
  onHotspotClick: (id: string) => void; 
  activeHotspot: string | null;
}) => {
  const group = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (group.current) {
      // Subtle automatic rotation when not interacting
      group.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 2.7, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f5d0c4" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
        <meshStandardMaterial color="#f5d0c4" />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.8, 1.5, 8, 16]} />
        <meshStandardMaterial color="#f0b7a4" />
      </mesh>
      
      {/* Left Arm */}
      <mesh position={[-1.1, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <capsuleGeometry args={[0.2, 1.5, 8, 16]} />
        <meshStandardMaterial color="#f5d0c4" />
      </mesh>
      
      {/* Right Arm */}
      <mesh position={[1.1, 1.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <capsuleGeometry args={[0.2, 1.5, 8, 16]} />
        <meshStandardMaterial color="#f5d0c4" />
      </mesh>
      
      {/* Left Leg */}
      <mesh position={[-0.5, -1, 0]} rotation={[0, 0, Math.PI / 20]}>
        <capsuleGeometry args={[0.25, 1.8, 8, 16]} />
        <meshStandardMaterial color="#f5d0c4" />
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[0.5, -1, 0]} rotation={[0, 0, -Math.PI / 20]}>
        <capsuleGeometry args={[0.25, 1.8, 8, 16]} />
        <meshStandardMaterial color="#f5d0c4" />
      </mesh>
      
      {/* Add 3D hotspots */}
      {hotspots.map((hotspot) => (
        <group key={hotspot.id} position={[hotspot.x / 25 - 2, hotspot.y / 25 - 2, hotspot.z / 50]}>
          <mesh 
            onClick={() => onHotspotClick(hotspot.id)}
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
  
  return <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />;
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
          <Canvas className="w-full h-full">
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <CameraControls zoom={zoom} setZoom={setZoom} />
              <HumanModel 
                hotspots={enhancedHotspots} 
                onHotspotClick={handleHotspotClick} 
                activeHotspot={activeHotspot} 
              />
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
