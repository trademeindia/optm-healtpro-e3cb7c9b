
import React from 'react';
import { motion } from 'framer-motion';
import { PackageCheck, PackagePlus, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DependencyFilterProps {
  filters: {
    showDev: boolean;
    showProd: boolean;
    showOutdated: boolean;
    showVulnerable: boolean;
  };
  updateFilters: (filters: {
    showDev: boolean;
    showProd: boolean;
    showOutdated: boolean;
    showVulnerable: boolean;
  }) => void;
}

const DependencyFilter: React.FC<DependencyFilterProps> = ({ filters, updateFilters }) => {
  const handleCheckboxChange = (field: keyof typeof filters) => {
    updateFilters({
      ...filters,
      [field]: !filters[field]
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showProd" 
            checked={filters.showProd} 
            onCheckedChange={() => handleCheckboxChange('showProd')}
          />
          <Label 
            htmlFor="showProd" 
            className="flex items-center space-x-2 text-sm cursor-pointer"
          >
            <PackageCheck className="h-4 w-4 text-blue-500" />
            <span>Production Deps</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showDev" 
            checked={filters.showDev} 
            onCheckedChange={() => handleCheckboxChange('showDev')}
          />
          <Label 
            htmlFor="showDev" 
            className="flex items-center space-x-2 text-sm cursor-pointer"
          >
            <PackagePlus className="h-4 w-4 text-purple-500" />
            <span>Development Deps</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showOutdated" 
            checked={filters.showOutdated} 
            onCheckedChange={() => handleCheckboxChange('showOutdated')}
          />
          <Label 
            htmlFor="showOutdated" 
            className="flex items-center space-x-2 text-sm cursor-pointer"
          >
            <ArrowUpCircle className="h-4 w-4 text-amber-500" />
            <span>Updates Available</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showVulnerable" 
            checked={filters.showVulnerable} 
            onCheckedChange={() => handleCheckboxChange('showVulnerable')}
          />
          <Label 
            htmlFor="showVulnerable" 
            className="flex items-center space-x-2 text-sm cursor-pointer"
          >
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Vulnerable Deps</span>
          </Label>
        </div>
      </div>
    </motion.div>
  );
};

export default DependencyFilter;
