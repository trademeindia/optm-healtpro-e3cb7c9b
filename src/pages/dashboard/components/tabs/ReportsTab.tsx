
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReportsTab: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Reports & Documents</h2>
      <p className="text-muted-foreground mb-6">
        View and manage all patient reports and medical documents
      </p>
      
      <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your files here, or click to select files
          </p>
          <Button>
            Select Files
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
