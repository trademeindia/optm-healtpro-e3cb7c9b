
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateBiomarker } from './biomarkerGenerator';
import { Biomarker } from '@/data/mockBiomarkerData';

interface UseFileUploadProps {
  onProcessComplete: (newBiomarker: Biomarker) => void;
}

export const useFileUpload = ({ onProcessComplete }: UseFileUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingFile, setProcessingFile] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      
      // Give immediate feedback that the file was selected
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} is ready for processing`,
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
    
    // Simulate upload progress - more realistic speeds
    let progress = 0;
    const uploadSpeed = Math.random() * 5 + 5; // Between 5-10% per tick
    const interval = setInterval(() => {
      progress += uploadSpeed;
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
      }
      setUploadProgress(Math.min(Math.round(progress), 100));
      
      if (progress >= 100) {
        setTimeout(() => {
          setIsUploading(false);
          setProcessingFile(true);
          
          // Simulate AI processing of the file
          simulateProcessing();
        }, 500);
      }
    }, 300);
  };

  const simulateProcessing = () => {
    // Simulate processing time between 1-3 seconds
    const processingTime = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      setProcessingFile(false);
      
      // Generate a new biomarker with data that looks like it was extracted from the file
      const newBiomarker = generateBiomarker();
      
      // Call the callback to add the biomarker to the state in the parent component
      onProcessComplete(newBiomarker);
      
      // Reset the form
      setUploadedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      toast({
        title: "Analysis complete",
        description: `New ${newBiomarker.name} data has been extracted and added to your profile`,
      });
    }, processingTime);
  };

  return {
    isUploading,
    uploadProgress,
    processingFile,
    uploadedFile,
    handleFileChange,
    removeFile,
    uploadFile
  };
};
