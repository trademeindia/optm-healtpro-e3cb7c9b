
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
      <TabsList className="flex w-full overflow-x-auto space-x-1 p-1 tabs-container">
        <TabsTrigger 
          value="full-body" 
          className="flex-shrink-0 text-xs sm:text-sm py-2 px-3 h-auto min-h-9 whitespace-nowrap"
        >
          Full body
        </TabsTrigger>
        <TabsTrigger 
          value="skin" 
          className="flex-shrink-0 text-xs sm:text-sm py-2 px-3 h-auto min-h-9 whitespace-nowrap"
        >
          Skin
        </TabsTrigger>
        <TabsTrigger 
          value="muscular" 
          className="flex-shrink-0 text-xs sm:text-sm py-2 px-3 h-auto min-h-9 whitespace-nowrap"
        >
          Muscular
        </TabsTrigger>
        <TabsTrigger 
          value="skeletal" 
          className="flex-shrink-0 text-xs sm:text-sm py-2 px-3 h-auto min-h-9 whitespace-nowrap"
        >
          Skeletal
        </TabsTrigger>
        <TabsTrigger 
          value="organs" 
          className="flex-shrink-0 text-xs sm:text-sm py-2 px-3 h-auto min-h-9 whitespace-nowrap"
        >
          Organs
        </TabsTrigger>
        <TabsTrigger 
          value="vascular" 
          className="flex-shrink-0 text-xs sm:text-sm py-2 px-3 h-auto min-h-9 whitespace-nowrap"
        >
          Vascular
        </TabsTrigger>
        <TabsTrigger 
          value="nervous" 
          className="flex-shrink-0 text-xs sm:text-sm py-2 px-3 h-auto min-h-9 whitespace-nowrap"
        >
          Nervous
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SystemTabs;
