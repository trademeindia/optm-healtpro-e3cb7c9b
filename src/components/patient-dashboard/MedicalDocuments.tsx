import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface MedicalDocumentsProps {
  className?: string;
}
const MedicalDocuments: React.FC<MedicalDocumentsProps> = ({
  className
}) => {
  return <div className="">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Medical Documents</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">MRI Results</h4>
              <p className="text-xs text-muted-foreground">May 28, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Blood Test Results</h4>
              <p className="text-xs text-muted-foreground">Jun 10, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Treatment Plan PDF</h4>
              <p className="text-xs text-muted-foreground">Jun 15, 2023</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>;
};
export default MedicalDocuments;