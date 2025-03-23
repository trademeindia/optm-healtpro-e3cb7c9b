
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search, Filter } from 'lucide-react';
import { Dependencies } from '../../types';
import { Input } from '@/components/ui/input';
import DependencyList from './DependencyList';
import DependencyChart from './DependencyChart';
import VulnerabilitySummary from './VulnerabilitySummary';
import DependencyFilter from './DependencyFilter';

interface DependenciesPanelProps {
  dependencies: Dependencies;
  checkForUpdates: () => void;
}

const DependenciesPanel: React.FC<DependenciesPanelProps> = ({
  dependencies,
  checkForUpdates
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    showDev: true,
    showProd: true,
    showOutdated: false,
    showVulnerable: false
  });
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const updateFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dependencies</h2>
          <p className="text-muted-foreground">
            Manage and monitor project dependencies and packages
          </p>
        </div>
        
        <Button onClick={checkForUpdates} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Check for Updates
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2">
          <VulnerabilitySummary vulnerabilities={dependencies.vulnerabilities} />
        </div>
        
        <div>
          <DependencyChart 
            totalCount={dependencies.packages.length}
            outdatedCount={dependencies.packages.filter(pkg => pkg.isOutdated).length}
            devCount={dependencies.packages.filter(pkg => pkg.isDev).length}
            vulnerableCount={dependencies.packages.filter(pkg => pkg.vulnerabilities.length > 0).length}
          />
        </div>
      </motion.div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input 
              type="text"
              placeholder="Search dependencies..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={toggleFilters}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(filters.showOutdated || filters.showVulnerable || !filters.showDev || !filters.showProd) && (
                <span className="ml-1 w-2 h-2 rounded-full bg-primary"></span>
              )}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <DependencyFilter filters={filters} updateFilters={updateFilters} />
          </motion.div>
        )}
        
        <DependencyList 
          packages={dependencies.packages} 
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default DependenciesPanel;
