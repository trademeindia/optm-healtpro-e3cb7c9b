
import React, { useState } from 'react';
import { BodyRegion, PainSymptom } from '../types';
import SymptomHistoryTable from './SymptomHistoryTable';
import SymptomDialog from '../SymptomDialog';
import SymptomDetailsDialog from '../SymptomDetailsDialog';

interface SymptomHistoryContainerProps {
  symptoms: PainSymptom[];
  bodyRegions: BodyRegion[];
  onUpdateSymptom: (symptom: PainSymptom) => void;
  onDeleteSymptom: (symptomId: string) => void;
  onToggleActive: (symptomId: string, isActive: boolean) => void;
  loading: boolean;
}

const SymptomHistoryContainer: React.FC<SymptomHistoryContainerProps> = ({
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

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold">Symptom History</h2>
      
      <SymptomHistoryTable 
        symptoms={symptoms}
        bodyRegions={bodyRegions}
        onToggleActive={onToggleActive}
        loading={loading}
        onViewDetails={handleViewDetails}
        onEditClick={handleEditClick}
        onDeleteSymptom={onDeleteSymptom}
      />
      
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

export default SymptomHistoryContainer;
