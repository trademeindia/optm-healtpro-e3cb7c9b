
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SystemTabsProps {
  activeSystem: string;
  onSystemChange: (system: string) => void;
}

const SystemTabs: React.FC<SystemTabsProps> = ({ activeSystem, onSystemChange }) => {
  const systems = [
    { id: 'muscular', label: 'Muscular' },
    { id: 'skeletal', label: 'Skeletal' },
    { id: 'nervous', label: 'Nervous' },
    { id: 'circulatory', label: 'Circulatory' }
  ];

  return (
    <Tabs value={activeSystem} onValueChange={onSystemChange}>
      <TabsList className="w-full">
        {systems.map((system) => (
          <TabsTrigger 
            key={system.id} 
            value={system.id}
            className="flex-1"
          >
            {system.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default SystemTabs;
