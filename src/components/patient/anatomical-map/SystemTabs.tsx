
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SystemTabsProps {
  activeSystem: string;
  onSystemChange: (value: string) => void;
}

const SystemTabs: React.FC<SystemTabsProps> = ({ activeSystem, onSystemChange }) => {
  return (
    <Tabs value={activeSystem} onValueChange={onSystemChange} className="mb-4">
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1 w-full overflow-x-auto bg-background border border-border">
        <TabsTrigger value="full-body" className="px-2 py-1.5 text-sm whitespace-nowrap text-foreground">
          Full Body
        </TabsTrigger>
        <TabsTrigger value="muscular" className="px-2 py-1.5 text-sm whitespace-nowrap text-foreground">
          Muscular
        </TabsTrigger>
        <TabsTrigger value="skeletal" className="px-2 py-1.5 text-sm whitespace-nowrap text-foreground">
          Skeletal
        </TabsTrigger>
        <TabsTrigger value="organs" className="px-2 py-1.5 text-sm whitespace-nowrap text-foreground">
          Organs
        </TabsTrigger>
        <TabsTrigger value="vascular" className="px-2 py-1.5 text-sm whitespace-nowrap text-foreground">
          Vascular
        </TabsTrigger>
        <TabsTrigger value="nervous" className="px-2 py-1.5 text-sm whitespace-nowrap text-foreground">
          Nervous
        </TabsTrigger>
        <TabsTrigger value="skin" className="px-2 py-1.5 text-sm whitespace-nowrap text-foreground">
          Skin
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SystemTabs;
