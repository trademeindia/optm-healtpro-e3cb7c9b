
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BiomarkerFilterProps } from './types';

const BiomarkerFilter: React.FC<BiomarkerFilterProps> = ({ filter, setFilter }) => {
  return (
    <Tabs defaultValue={filter} className="w-full" onValueChange={setFilter}>
      <TabsList>
        <TabsTrigger value="all">All Biomarkers</TabsTrigger>
        <TabsTrigger value="normal">Normal</TabsTrigger>
        <TabsTrigger value="elevated">Elevated</TabsTrigger>
        <TabsTrigger value="critical">Critical</TabsTrigger>
        <TabsTrigger value="low">Low</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default BiomarkerFilter;
