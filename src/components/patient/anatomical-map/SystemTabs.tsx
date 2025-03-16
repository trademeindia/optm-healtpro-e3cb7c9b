
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

interface SystemTabsProps {
  activeSystem: string;
  onSystemChange: (value: string) => void;
}

const SystemTabs: React.FC<SystemTabsProps> = ({ activeSystem, onSystemChange }) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs value={activeSystem} onValueChange={onSystemChange} className="w-full">
      <TabsList className={`grid ${isMobile ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-7'} w-full`}>
        <TabsTrigger value="full-body" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
          Full Body
        </TabsTrigger>
        <TabsTrigger value="muscular" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
          Muscular
        </TabsTrigger>
        <TabsTrigger value="skeletal" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
          Skeletal
        </TabsTrigger>
        
        {isMobile ? (
          <>
            <TabsTrigger value="organs" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
              Organs
            </TabsTrigger>
            <TabsTrigger value="vascular" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
              Vascular
            </TabsTrigger>
            <TabsTrigger value="nervous" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
              Nervous
            </TabsTrigger>
            <TabsTrigger value="skin" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
              Skin
            </TabsTrigger>
          </>
        ) : (
          <>
            <TabsTrigger value="organs" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
              Organs
            </TabsTrigger>
            <TabsTrigger value="vascular" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
              Vascular
            </TabsTrigger>
            <TabsTrigger value="nervous" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
              Nervous
            </TabsTrigger>
            <TabsTrigger value="skin" className="text-xs md:text-sm whitespace-nowrap px-2 md:px-3 py-1">
              Skin
            </TabsTrigger>
          </>
        )}
      </TabsList>
    </Tabs>
  );
};

export default SystemTabs;
