
import React from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadTabProps {
  file: File | null;
  isProcessing: boolean;
  processingProgress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessFile: () => void;
}

const UploadTab: React.FC<UploadTabProps> = ({
  file,
  isProcessing,
  processingProgress,
  onFileChange,
  onProcessFile
}) => {
  return (
    <div className="space-y-5 h-full flex flex-col">
      <div 
        className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center flex-grow"
      >
        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">Upload Medical Report</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          Drag and drop your medical report file, or click to browse. We support PDF, JPG, and PNG formats.
        </p>
        <div>
          <label htmlFor="report-upload" className="cursor-pointer">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer inline-flex items-center transition-colors hover:bg-primary/90">
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </div>
            <input 
              id="report-upload" 
              type="file" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onFileChange}
            />
          </label>
        </div>
        {file && (
          <div className="mt-4 text-sm bg-primary/5 px-4 py-2 rounded-md">
            Selected: <span className="font-medium">{file.name}</span>
          </div>
        )}
      </div>
      
      {isProcessing ? (
        <div className="space-y-2 bg-background/80 p-4 rounded-lg border border-border/50">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Analyzing your report...</span>
            <span className="text-primary font-medium">{Math.round(processingProgress)}%</span>
          </div>
          <Progress value={processingProgress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-2">
            Our AI is examining your medical data and preparing an easy-to-understand explanation
          </div>
        </div>
      ) : (
        <Button 
          className="w-full transition-all"
          onClick={onProcessFile}
          disabled={!file}
          size="lg"
        >
          <Upload className="mr-2 h-4 w-4" />
          Analyze Report
        </Button>
      )}
    </div>
  );
};

export default UploadTab;
