
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, Calendar, Filter } from 'lucide-react';
import { Biomarker } from '@/data/mockBiomarkerData';
import BiomarkerDisplay from '@/components/dashboard/BiomarkerDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';

interface ViewBiomarkersTabProps {
  biomarkers: Biomarker[];
}

const ViewBiomarkersTab: React.FC<ViewBiomarkersTabProps> = ({ biomarkers }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Process the biomarkers data
  const filteredBiomarkers = biomarkers.filter(biomarker => {
    if (filterStatus === 'all') return true;
    return biomarker.status === filterStatus;
  });

  const sortedBiomarkers = [...filteredBiomarkers].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'status') {
      // Sort by severity (critical > elevated > low > normal)
      const statusOrder = { critical: 3, elevated: 2, low: 1, normal: 0 };
      return statusOrder[b.status] - statusOrder[a.status];
    }
    return 0;
  });

  // Get stats for the summary section
  const totalBiomarkers = biomarkers.length;
  const normalCount = biomarkers.filter(b => b.status === 'normal').length;
  const elevatedCount = biomarkers.filter(b => b.status === 'elevated').length;
  const lowCount = biomarkers.filter(b => b.status === 'low').length;
  const criticalCount = biomarkers.filter(b => b.status === 'critical').length;
  
  const latestUpdate = biomarkers.length > 0 
    ? new Date(Math.max(...biomarkers.map(b => new Date(b.timestamp).getTime()))).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : 'No data';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  Your Biomarker Data
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  Last updated: {latestUpdate}
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant={filterStatus === 'all' ? "default" : "outline"} 
                       className="cursor-pointer" 
                       onClick={() => setFilterStatus('all')}>
                  All ({totalBiomarkers})
                </Badge>
                <Badge variant={filterStatus === 'normal' ? "default" : "outline"} 
                       className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200" 
                       onClick={() => setFilterStatus('normal')}>
                  Normal ({normalCount})
                </Badge>
                <Badge variant={filterStatus === 'elevated' ? "default" : "outline"} 
                       className="cursor-pointer bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                       onClick={() => setFilterStatus('elevated')}>
                  Elevated ({elevatedCount})
                </Badge>
                <Badge variant={filterStatus === 'low' ? "default" : "outline"} 
                       className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200" 
                       onClick={() => setFilterStatus('low')}>
                  Low ({lowCount})
                </Badge>
                {criticalCount > 0 && (
                  <Badge variant={filterStatus === 'critical' ? "default" : "outline"} 
                         className="cursor-pointer bg-red-100 text-red-800 hover:bg-red-200" 
                         onClick={() => setFilterStatus('critical')}>
                    Critical ({criticalCount})
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {biomarkers.length > 0 && (
              <div className="mb-6 flex justify-end items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <BiomarkerDisplay biomarkers={sortedBiomarkers} />
            
            {biomarkers.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium mb-2">Understanding Your Biomarkers</h3>
                <p className="text-sm text-muted-foreground">
                  Biomarkers are measurable indicators that reflect your health status. They can help identify potential health risks, monitor disease progression, and assess treatment effectiveness. Click on individual biomarkers for more details and personalized insights.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ViewBiomarkersTab;
