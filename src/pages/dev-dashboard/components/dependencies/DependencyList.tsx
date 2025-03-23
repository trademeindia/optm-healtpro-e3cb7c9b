
import React from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, ArrowUpCircle, ExternalLink } from 'lucide-react';
import { DependencyPackage } from '../../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DependencyListProps {
  packages: DependencyPackage[];
  searchQuery: string;
  filters: {
    showDev: boolean;
    showProd: boolean;
    showOutdated: boolean;
    showVulnerable: boolean;
  };
}

const DependencyList: React.FC<DependencyListProps> = ({ packages, searchQuery, filters }) => {
  const filteredPackages = packages.filter(pkg => {
    // Filter by search query
    if (searchQuery && !pkg.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by package type
    if ((pkg.isDev && !filters.showDev) || (!pkg.isDev && !filters.showProd)) {
      return false;
    }
    
    // Filter by outdated status
    if (filters.showOutdated && !pkg.isOutdated) {
      return false;
    }
    
    // Filter by vulnerable status
    if (filters.showVulnerable && pkg.vulnerabilities.length === 0) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="rounded-md border overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[240px]">Package</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Latest</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No packages match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredPackages.map((pkg, index) => (
                <motion.tr
                  key={pkg.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  className="text-sm border-b last:border-0"
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span>{pkg.name}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{pkg.currentVersion}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {pkg.latestVersion !== pkg.currentVersion ? (
                      <span className="font-medium text-green-600 dark:text-green-400">{pkg.latestVersion}</span>
                    ) : (
                      pkg.latestVersion
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pkg.isDev ? "secondary" : "default"} className="font-normal">
                      {pkg.isDev ? 'dev' : 'prod'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {pkg.vulnerabilities.length > 0 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="destructive" className="flex items-center gap-1 font-normal">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{pkg.vulnerabilities.length} vulnerabilities</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">Vulnerabilities:</p>
                              {pkg.vulnerabilities.map((vuln, i) => (
                                <p key={i} className="text-xs">{vuln.severity}: {vuln.description}</p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : pkg.isOutdated ? (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 font-normal">
                        Update available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-200 font-normal">
                        Up to date
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {pkg.isOutdated && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowUpCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Update package
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            View package documentation
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default DependencyList;
