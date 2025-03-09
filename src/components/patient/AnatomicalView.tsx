
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BadgeAlert, Hand, Target } from 'lucide-react';

interface AnatomicalViewProps {
  selectedRegion?: string;
  onSelectRegion?: (region: string) => void;
}

const AnatomicalView: React.FC<AnatomicalViewProps> = ({ selectedRegion, onSelectRegion }) => {
  const [activeSystem, setActiveSystem] = useState('muscular');
  
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

  // Hotspots with their positions (percentages of the container)
  const hotspots = [
    { id: 'shoulder', x: 31, y: 26, label: 'Shoulder', description: 'Calcific tendinitis' },
    { id: 'heart', x: 50, y: 30, label: 'Heart', description: 'Normal' },
    { id: 'abdomen', x: 50, y: 47, label: 'Lower Abdomen', description: 'Check required' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full flex flex-col">
      <div className="p-3 border-b dark:border-gray-700">
        <Tabs defaultValue={activeSystem} onValueChange={setActiveSystem} className="w-full">
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

      <div className="flex-1 relative overflow-hidden pt-4 pb-6 px-4">
        {/* Main anatomical image */}
        <div className="w-full h-full flex items-center justify-center relative">
          <img
            src="/lovable-uploads/f9cf0fb7-42a3-40b1-90b9-c7c2b44003a3.png"
            alt="Human anatomy model"
            className="max-h-[500px] object-contain"
          />

          {/* Hotspots */}
          {hotspots.map((hotspot) => (
            <TooltipProvider key={hotspot.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    className={`absolute z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-md ${
                      hotspot.id === 'shoulder' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => onSelectRegion && onSelectRegion(hotspot.id)}
                  >
                    {hotspot.id === 'shoulder' ? (
                      <BadgeAlert className="h-4 w-4 text-white" />
                    ) : (
                      <Target className="h-4 w-4 text-white" />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <p className="font-medium">{hotspot.label}</p>
                    <p className="text-xs">{hotspot.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Control buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-gray-700 shadow-md">
            <Hand className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-gray-700 shadow-md">
            <Target className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnatomicalView;
