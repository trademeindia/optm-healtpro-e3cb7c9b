
import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Biomarker } from '@/data/mockBiomarkerData';

interface BiomarkerUploadProps {
  onProcessComplete: (newBiomarker: Biomarker) => void;
}

const BiomarkerUpload: React.FC<BiomarkerUploadProps> = ({ onProcessComplete }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingFile, setProcessingFile] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      setProcessingFile(true);
      
      setTimeout(() => {
        setProcessingFile(false);
        
        // Create a few biomarkers based on the file name to simulate processing results
        const biomarkerTypes = ['Vitamin D', 'Cholesterol', 'Glucose', 'Iron'];
        const randomIndex = Math.floor(Math.random() * biomarkerTypes.length);
        const biomarkerName = biomarkerTypes[randomIndex];
        
        // Sample values for different biomarker types
        const biomarkerValues = {
          'Vitamin D': { value: 28, unit: 'ng/mL', normalRange: '30-50', status: 'low', percentage: 56 },
          'Cholesterol': { value: 195, unit: 'mg/dL', normalRange: '125-200', status: 'normal', percentage: 78 },
          'Glucose': { value: 110, unit: 'mg/dL', normalRange: '70-99', status: 'elevated', percentage: 65 },
          'Iron': { value: 80, unit: 'μg/dL', normalRange: '60-170', status: 'normal', percentage: 82 }
        };
        
        const selectedBiomarker = biomarkerValues[biomarkerName as keyof typeof biomarkerValues];
        
        const newBiomarker: Biomarker = {
          id: `bm${Date.now()}`,
          name: biomarkerName,
          value: selectedBiomarker.value,
          unit: selectedBiomarker.unit,
          normalRange: selectedBiomarker.normalRange,
          status: selectedBiomarker.status as 'normal' | 'elevated' | 'low' | 'critical',
          timestamp: new Date().toISOString(),
          percentage: selectedBiomarker.percentage,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          description: `Important health indicator extracted from your uploaded test results`
        };
        
        // Call the callback to add the biomarker to the state in the parent component
        onProcessComplete(newBiomarker);
        
        // Reset the form
        setUploadedFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        toast({
          title: "File processed successfully",
          description: `New ${biomarkerName} data has been added to your profile`,
        });
      }, 2000);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Test Results
        </CardTitle>
        <CardDescription>
          Upload your blood test reports or biomarker images for automatic processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading || processingFile}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-base font-medium">
                {uploadedFile ? uploadedFile.name : 'Drag and drop or click to upload'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports: PDF, JPG, PNG
              </p>
            </label>
          </div>
          
          {uploadedFile && !isUploading && !processingFile && (
            <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {uploadedFile.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedFile(null)}
                className="h-7 w-7 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {isUploading && (
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          
          {processingFile && (
            <div className="flex items-center justify-center space-x-2 py-2">
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm">Processing your file with AI...</span>
            </div>
          )}
          
          <Button
            onClick={uploadFile}
            className="w-full"
            disabled={!uploadedFile || isUploading || processingFile}
          >
            {isUploading ? 'Uploading...' : processingFile ? 'Processing...' : 'Upload and Process'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerUpload;
