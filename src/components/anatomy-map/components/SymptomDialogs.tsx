
import React from 'react';
import SymptomDialog from '../SymptomDialog';
import SymptomDetailsDialog from '../SymptomDetailsDialog';
import { BodyRegion, PainSymptom } from '../types';

interface SymptomDialogsProps {
  addDialogOpen: boolean;
  detailsDialogOpen: boolean;
  selectedRegion: BodyRegion | null;
  selectedSymptom: PainSymptom | null;
  onCloseAddDialog: () => void;
  onCloseDetailsDialog: () => void;
  onAddSymptom: (data: Omit<PainSymptom, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
  onUpdateSymptom: (symptom: PainSymptom) => void;
  onDeleteSymptom: (symptomId: string) => void;
}

const SymptomDialogs: React.FC<SymptomDialogsProps> = ({
  addDialogOpen,
  detailsDialogOpen,
  selectedRegion,
  selectedSymptom,
  onCloseAddDialog,
  onCloseDetailsDialog,
  onAddSymptom,
  onUpdateSymptom,
  onDeleteSymptom
}) => {
  return (
    <>
      {addDialogOpen && (
        <SymptomDialog
          open={addDialogOpen}
          onClose={onCloseAddDialog}
          selectedRegion={selectedRegion}
          existingSymptom={null}
          isEditMode={false}
          onAdd={onAddSymptom}
          onUpdate={onUpdateSymptom}
          onDelete={onDeleteSymptom}
        />
      )}

      {detailsDialogOpen && (
        <SymptomDetailsDialog
          open={detailsDialogOpen}
          onClose={onCloseDetailsDialog}
          symptom={selectedSymptom}
          region={selectedRegion}
        />
      )}
    </>
  );
};

export default SymptomDialogs;
