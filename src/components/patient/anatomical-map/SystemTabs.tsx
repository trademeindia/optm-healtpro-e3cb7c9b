
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SystemTabsProps {
  activeSystem: string;
  onSystemChange: (value: string) => void;
}

const SystemTabs: React.FC<SystemTabsProps> = ({ activeSystem, onSystemChange }) => {
  return (
    <Tabs value={activeSystem} onValueChange={onSystemChange} className="mb-4">
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1 w-full overflow-x-auto">
        <TabsTrigger value="full-body" className="px-2 py-1.5 text-sm whitespace-nowrap">
          Full Body
        </TabsTrigger>
        <TabsTrigger value="muscular" className="px-2 py-1.5 text-sm whitespace-nowrap">
          Muscular
        </TabsTrigger>
        <TabsTrigger value="skeletal" className="px-2 py-1.5 text-sm whitespace-nowrap">
          Skeletal
        </TabsTrigger>
        <TabsTrigger value="organs" className="px-2 py-1.5 text-sm whitespace-nowrap">
          Organs
        </TabsTrigger>
        <TabsTrigger value="vascular" className="px-2 py-1.5 text-sm whitespace-nowrap">
          Vascular
        </TabsTrigger>
        <TabsTrigger value="nervous" className="px-2 py-1.5 text-sm whitespace-nowrap">
          Nervous
        </TabsTrigger>
        <TabsTrigger value="skin" className="px-2 py-1.5 text-sm whitespace-nowrap">
          Skin
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SystemTabs;
