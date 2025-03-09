
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
        
        // Generate a new biomarker with random data
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
          title: "File processed successfully",
          description: `New ${newBiomarker.name} data has been added to your profile`,
        });
      }, 2000);
    }, 3000);
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
