
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
      <TabsList className="grid grid-cols-7 w-full">
        <TabsTrigger value="full-body" className="text-xs sm:text-sm">Full body</TabsTrigger>
        <TabsTrigger value="skin" className="text-xs sm:text-sm">Skin</TabsTrigger>
        <TabsTrigger value="muscular" className="text-xs sm:text-sm">Muscular</TabsTrigger>
        <TabsTrigger value="skeletal" className="text-xs sm:text-sm">Skeletal</TabsTrigger>
        <TabsTrigger value="organs" className="text-xs sm:text-sm">Organs</TabsTrigger>
        <TabsTrigger value="vascular" className="text-xs sm:text-sm">Vascular</TabsTrigger>
        <TabsTrigger value="nervous" className="text-xs sm:text-sm">Nervous</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SystemTabs;
