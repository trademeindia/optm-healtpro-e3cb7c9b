import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface SystemTabsProps {
  activeSystem: string;
  onSystemChange: (value: string) => void;
}
const SystemTabs: React.FC<SystemTabsProps> = ({
  activeSystem,
  onSystemChange
}) => {
  return <Tabs value={activeSystem} onValueChange={onSystemChange} className="mb-4">
      
    </Tabs>;
};
export default SystemTabs;