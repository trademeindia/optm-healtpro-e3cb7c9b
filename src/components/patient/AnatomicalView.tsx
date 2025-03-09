import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment, PerspectiveCamera } from '@react-three/drei';
import { Vector3, Euler } from 'three';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  BadgeAlert, 
  Hand, 
  Target, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Info 
} from 'lucide-react';
import { useSymptoms } from '@/contexts/SymptomContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnatomicalViewProps {
  selectedRegion?: string;
  onSelectRegion?: (region: string) => void;
  patientId?: number;
}

// Interface for a medical issue hotspot
interface Hotspot {
  id: string;
  position: [number, number, number]; // 3D coordinates
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  color: string;
  size: number;
}

// Component that renders a single hotspot
const Hotspot = ({ 
  position, 
  color, 
  size, 
  onClick, 
  label, 
  description,
  severity
}: {
  position: [number, number, number];
  color: string;
  size: number;
  onClick: () => void;
  label: string;
  description: string;
  severity: string;
}) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.8} 
          emissive={color} 
          emissiveIntensity={hovered ? 1 : 0.5} 
        />
      </mesh>
      
      {hovered && (
        <Html
          position={[0, size + 0.1, 0]}
          center
          style={{
            width: '160px',
            pointerEvents: 'none',
          }}
        >
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 text-sm border z-50">
            <div className="font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
            <div className={`text-xs mt-1 ${
              severity === 'high' ? 'text-red-500' : 
              severity === 'medium' ? 'text-orange-500' : 
              'text-green-500'
            }`}>
              Severity: {severity}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Helper component for auto-rotating the model
const AutoRotate = ({ isRotating }: { isRotating: boolean }) => {
  const { camera } = useThree();
  
  useFrame(({ clock }) => {
    if (isRotating) {
      camera.position.x = Math.sin(clock.getElapsedTime() * 0.2) * 5;
      camera.position.z = Math.cos(clock.getElapsedTime() * 0.2) * 5;
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
};

// Component that loads and displays the 3D human anatomy model
const HumanModel = ({ 
  activeSystem, 
  hotspots, 
  onHotspotClick 
}: { 
  activeSystem: string, 
  hotspots: Hotspot[],
  onHotspotClick: (id: string) => void
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setModelLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!modelLoaded) {
    return (
      <Html center>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading anatomical model...</p>
        </div>
      </Html>
    );
  }
  
  return (
    <group>
      <Html
        transform
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        center
        sprite
      >
        <img 
          src="/lovable-uploads/3e04ef50-20da-4d98-8be4-6c2ba39fbe32.png" 
          alt="Human Anatomy" 
          className="w-[400px] h-auto"
          style={{ opacity: 1, pointerEvents: 'none' }}
        />
      </Html>
      
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          position={hotspot.position}
          color={hotspot.color}
          size={hotspot.size}
          label={hotspot.label}
          description={hotspot.description}
          severity={hotspot.severity}
          onClick={() => onHotspotClick(hotspot.id)}
        />
      ))}
    </group>
  );
};

const AnatomicalView: React.FC<AnatomicalViewProps> = ({ 
  selectedRegion, 
  onSelectRegion,
  patientId 
}) => {
  const [activeSystem, setActiveSystem] = useState('muscular');
  const [isRotating, setIsRotating] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const { symptoms } = useSymptoms();
  
  const bodySystems = [
    { id: 'full', label: 'Full body' },
    { id: 'skin', label: 'Skin' },
    { id: 'muscular', label: 'Muscular' },
    { id: 'skeletal', label: 'Skeletal' },
    { id: 'organs', label: 'Organs' },
    { id: 'vascular', label: 'Vascular' },
    { id: 'nervous', label: 'Nervous' },
    { id: 'lymphatic', label: 'Lymphatic' }
  ];

  const getHotspotPosition = (location: string): [number, number, number] => {
    const positionMap: Record<string, [number, number, number]> = {
      head: [0, 1.7, 0.3],
      neck: [0, 1.4, 0.2],
      rightShoulder: [-0.8, 1.2, 0.3],
      leftShoulder: [0.8, 1.2, 0.3],
      chest: [0, 0.8, 0.4],
      rightElbow: [-1.2, 0.5, 0.3],
      leftElbow: [1.2, 0.5, 0.3],
      abdomen: [0, 0.2, 0.3],
      lowerBack: [0, 0.2, -0.3],
      rightHip: [-0.5, -0.3, 0.2],
      leftHip: [0.5, -0.3, 0.2],
      rightKnee: [-0.3, -1.0, 0.3],
      leftKnee: [0.3, -1.0, 0.3],
      rightAnkle: [-0.3, -1.7, 0.3],
      leftAnkle: [0.3, -1.7, 0.3],
    };
    
    return positionMap[location] || [0, 0, 0];
  };
  
  const getSeverityColor = (painLevel: number): string => {
    if (painLevel <= 3) return '#4CAF50';
    if (painLevel <= 6) return '#FF9800';
    return '#F44336';
  };
  
  const getSeverityLevel = (painLevel: number): 'low' | 'medium' | 'high' => {
    if (painLevel <= 3) return 'low';
    if (painLevel <= 6) return 'medium';
    return 'high';
  };
  
  const hotspots: Hotspot[] = symptoms.map(symptom => ({
    id: symptom.id,
    position: getHotspotPosition(symptom.location),
    label: symptom.symptomName,
    description: symptom.notes,
    severity: getSeverityLevel(symptom.painLevel),
    color: getSeverityColor(symptom.painLevel),
    size: 0.1 + (symptom.painLevel * 0.02)
  }));
  
  const handleZoomIn = () => {
    setCameraPosition(prev => [prev[0], prev[1], prev[2] - 1]);
  };
  
  const handleZoomOut = () => {
    setCameraPosition(prev => [prev[0], prev[1], prev[2] + 1]);
  };
  
  const handleResetView = () => {
    setCameraPosition([0, 0, 5]);
    setIsRotating(false);
  };
  
  const handleHotspotClick = (id: string) => {
    setActiveHotspot(id === activeHotspot ? null : id);
    if (onSelectRegion) {
      const symptom = symptoms.find(s => s.id === id);
      if (symptom) {
        onSelectRegion(symptom.location);
      }
    }
  };
  
  const activeHotspotDetails = activeHotspot 
    ? hotspots.find(h => h.id === activeHotspot) 
    : null;

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>3D Anatomical View</CardTitle>
            <CardDescription>Interactive visualization of patient issues</CardDescription>
          </div>
          
          <Tabs defaultValue={activeSystem} onValueChange={setActiveSystem} className="w-full max-w-[500px]">
            <TabsList className="bg-gray-100 dark:bg-gray-700 grid grid-flow-col auto-cols-fr w-full overflow-x-auto scrollbar-none">
              {bodySystems.map(system => (
                <TabsTrigger 
                  key={system.id} 
                  value={system.id}
                  className="whitespace-nowrap text-xs py-1.5"
                >
                  {system.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-4 pb-6 px-4 relative">
        <div className="w-full h-full flex items-center justify-center relative">
          <Canvas 
            style={{ width: '100%', height: '100%', minHeight: '500px' }}
            camera={{ position: [0, 0, 5], fov: 60 }}
          >
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={cameraPosition} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <OrbitControls 
                enableZoom={true} 
                enablePan={true}
                enableRotate={!isRotating}
                minDistance={2}
                maxDistance={10}
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
          
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white dark:bg-gray-700 shadow-md"
                    onClick={() => setIsRotating(!isRotating)}
                  >
                    <RotateCcw className={`h-4 w-4 ${isRotating ? 'text-primary' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRotating ? 'Stop rotation' : 'Auto-rotate'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white dark:bg-gray-700 shadow-md"
                    onClick={handleZoomIn}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white dark:bg-gray-700 shadow-md"
                    onClick={handleZoomOut}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white dark:bg-gray-700 shadow-md"
                    onClick={handleResetView}
                  >
                    <Target className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {activeHotspotDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border max-w-[300px] z-10"
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: activeHotspotDetails.color }}
              ></div>
              <h4 className="font-semibold">{activeHotspotDetails.label}</h4>
            </div>
            <p className="text-sm mb-2">{activeHotspotDetails.description}</p>
            <div className={`text-xs font-medium ${
              activeHotspotDetails.severity === 'high' ? 'text-red-500' : 
              activeHotspotDetails.severity === 'medium' ? 'text-orange-500' : 
              'text-green-500'
            }`}>
              Severity: {activeHotspotDetails.severity.charAt(0).toUpperCase() + activeHotspotDetails.severity.slice(1)}
            </div>
          </motion.div>
        )}
        
        {hotspots.length > 0 && (
          <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-full py-1 px-3 text-xs font-medium shadow-md border z-10 flex items-center gap-1.5">
            <Info className="h-3 w-3 text-muted-foreground" />
            <span>{hotspots.length} issue{hotspots.length !== 1 ? 's' : ''} detected</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnatomicalView;
