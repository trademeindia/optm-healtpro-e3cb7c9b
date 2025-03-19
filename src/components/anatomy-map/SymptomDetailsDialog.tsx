
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BodyRegion, PainSymptom } from './types';
import { format } from 'date-fns';

interface SymptomDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  symptom: PainSymptom;
  region: BodyRegion;
}

const SymptomDetailsDialog: React.FC<SymptomDetailsDialogProps> = ({
  open,
  onClose,
  symptom,
  region
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  const getSeverityColor = (severity: 'mild' | 'moderate' | 'severe') => {
    return severity === 'severe' ? 'bg-red-500' : 
           severity === 'moderate' ? 'bg-orange-500' : 
           'bg-yellow-500';
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Symptom Details</DialogTitle>
          <DialogDescription>
            Detailed information about your reported symptom
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{region.name}</h3>
            <Badge className={getSeverityColor(symptom.severity)}>
              {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)} Severity
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pain Type</p>
              <p>{symptom.painType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p>{symptom.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{symptom.description}</p>
          </div>
          
          {symptom.triggers && symptom.triggers.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Triggers</p>
              <div className="flex flex-wrap gap-2">
                {symptom.triggers.map((trigger, index) => (
                  <Badge key={index} variant="outline">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">First Reported</p>
              <p className="text-sm">{formatDate(symptom.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm">{formatDate(symptom.updatedAt)}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SymptomDetailsDialog;
