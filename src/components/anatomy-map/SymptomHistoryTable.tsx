
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Search 
} from 'lucide-react';
import { BodyRegion, PainSymptom, painSeverityOptions } from './types';
import { format } from 'date-fns';
import SymptomDialog from './SymptomDialog';
import SymptomDetailsDialog from './SymptomDetailsDialog';

interface SymptomHistoryTableProps {
  symptoms: PainSymptom[];
  bodyRegions: BodyRegion[];
  onUpdateSymptom: (symptom: PainSymptom) => void;
  onDeleteSymptom: (symptomId: string) => void;
  onToggleActive: (symptomId: string, isActive: boolean) => void;
  loading: boolean;
}

const SymptomHistoryTable: React.FC<SymptomHistoryTableProps> = ({
  symptoms,
  bodyRegions,
  onUpdateSymptom,
  onDeleteSymptom,
  onToggleActive,
  loading
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<PainSymptom | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  
  const handleEditClick = (symptom: PainSymptom) => {
    const region = bodyRegions.find(r => r.id === symptom.bodyRegionId) || null;
    setSelectedSymptom(symptom);
    setSelectedRegion(region);
    setEditDialogOpen(true);
  };
  
  const handleViewDetails = (symptom: PainSymptom) => {
    const region = bodyRegions.find(r => r.id === symptom.bodyRegionId) || null;
    setSelectedSymptom(symptom);
    setSelectedRegion(region);
    setDetailsDialogOpen(true);
  };
  
  const handleToggleActive = (symptom: PainSymptom) => {
    onToggleActive(symptom.id, !symptom.isActive);
  };
  
  const getRegionName = (regionId: string): string => {
    return bodyRegions.find(region => region.id === regionId)?.name || regionId;
  };
  
  const getSeverityBadge = (severity: 'mild' | 'moderate' | 'severe') => {
    const severityOption = painSeverityOptions.find(option => option.value === severity);
    
    const colorClass = 
      severity === 'severe' ? 'bg-red-500 hover:bg-red-600' : 
      severity === 'moderate' ? 'bg-orange-500 hover:bg-orange-600' : 
      'bg-yellow-500 hover:bg-yellow-600';
    
    return (
      <Badge className={colorClass}>
        {severityOption?.label || severity}
      </Badge>
    );
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (symptoms.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg font-medium mb-2">No symptom records found</p>
        <p className="text-muted-foreground mb-4">
          Use the Anatomy Map tab to add symptoms to your record.
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold">Symptom History</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Active</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {symptoms.map((symptom) => (
              <TableRow key={symptom.id}>
                <TableCell>
                  <Switch 
                    checked={symptom.isActive} 
                    onCheckedChange={() => handleToggleActive(symptom)}
                  />
                </TableCell>
                <TableCell className="font-medium">{getRegionName(symptom.bodyRegionId)}</TableCell>
                <TableCell>{getSeverityBadge(symptom.severity)}</TableCell>
                <TableCell>{symptom.painType}</TableCell>
                <TableCell>{formatDate(symptom.createdAt)}</TableCell>
                <TableCell>{formatDate(symptom.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(symptom)}>
                        <Search className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(symptom)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteSymptom(symptom.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Dialog */}
      {editDialogOpen && selectedSymptom && selectedRegion && (
        <SymptomDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          selectedRegion={selectedRegion}
          existingSymptom={selectedSymptom}
          isEditMode={true}
          onAdd={() => {}}
          onUpdate={onUpdateSymptom}
          onDelete={onDeleteSymptom}
        />
      )}
      
      {/* Details Dialog */}
      {detailsDialogOpen && selectedSymptom && selectedRegion && (
        <SymptomDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          symptom={selectedSymptom}
          region={selectedRegion}
        />
      )}
    </div>
  );
};

export default SymptomHistoryTable;
