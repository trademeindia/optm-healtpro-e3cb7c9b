
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SystemTabsProps {
  activeSystem: string;
  onSystemChange: (value: string) => void;
}

const SystemTabs: React.FC<SystemTabsProps> = ({ activeSystem, onSystemChange }) => {
  return (
    <Tabs 
      defaultValue="muscular" 
      value={activeSystem}
      onValueChange={onSystemChange}
      className="w-full mt-4"
    >
      <TabsList className="grid grid-cols-7 w-full md:gap-1 tabs-container">
        <TabsTrigger 
          value="full-body" 
          className="text-xs sm:text-sm py-2 px-2 h-auto min-h-9 whitespace-normal"
        >
          Full body
        </TabsTrigger>
        <TabsTrigger 
          value="skin" 
          className="text-xs sm:text-sm py-2 px-2 h-auto min-h-9 whitespace-normal"
        >
          Skin
        </TabsTrigger>
        <TabsTrigger 
          value="muscular" 
          className="text-xs sm:text-sm py-2 px-2 h-auto min-h-9 whitespace-normal"
        >
          Muscular
        </TabsTrigger>
        <TabsTrigger 
          value="skeletal" 
          className="text-xs sm:text-sm py-2 px-2 h-auto min-h-9 whitespace-normal"
        >
          Skeletal
        </TabsTrigger>
        <TabsTrigger 
          value="organs" 
          className="text-xs sm:text-sm py-2 px-2 h-auto min-h-9 whitespace-normal"
        >
          Organs
        </TabsTrigger>
        <TabsTrigger 
          value="vascular" 
          className="text-xs sm:text-sm py-2 px-2 h-auto min-h-9 whitespace-normal"
        >
          Vascular
        </TabsTrigger>
        <TabsTrigger 
          value="nervous" 
          className="text-xs sm:text-sm py-2 px-2 h-auto min-h-9 whitespace-normal"
        >
          Nervous
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SystemTabs;
