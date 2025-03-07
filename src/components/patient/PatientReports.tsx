
import React, { useState } from 'react';
import { FileText, Upload, AlertTriangle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface Report {
  id: string;
  title: string;
  date: string;
  fileType: string;
  fileSize: string;
  content?: string;
  url?: string;
}

const PatientReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'MRI Scan Results',
      date: '2023-05-15',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      url: '/sample-report.pdf'
    },
    {
      id: '2',
      title: 'Blood Test Results',
      date: '2023-06-02',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      url: '/sample-report.pdf'
    },
    {
      id: '3',
      title: 'X-Ray Results',
      date: '2023-06-10',
      fileType: 'Image',
      fileSize: '3.5 MB',
      url: '/sample-image.jpg'
    }
  ]);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleViewReport = (report: Report) => {
    setCurrentReport(report);
    setViewOpen(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setFileError(null);
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PDF and image files (JPEG, PNG) are allowed');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be less than 10MB');
      return;
    }
    
    setUploadedFile(file);
  };

  const handleUpload = () => {
    if (!uploadedFile) {
      setFileError('Please select a file to upload');
      return;
    }

    // Simulate upload process
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Add the new report
          const newReport: Report = {
            id: String(Date.now()),
            title: uploadedFile.name.substring(0, uploadedFile.name.lastIndexOf('.')),
            date: new Date().toISOString().split('T')[0],
            fileType: uploadedFile.type.includes('pdf') ? 'PDF' : 'Image',
            fileSize: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            url: URL.createObjectURL(uploadedFile)
          };
          
          setReports(prev => [...prev, newReport]);
          setUploadedFile(null);
          setUploadOpen(false);
          
          toast.success('Report uploaded successfully');
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.toLowerCase().includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (fileType.toLowerCase().includes('image')) {
      return <FileText className="h-6 w-6 text-blue-500" />;
    }
    return <FileText className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Medical Reports</h2>
        <Button onClick={() => setUploadOpen(true)} className="flex items-center gap-2">
          <Upload className="h-4 w-4" /> Upload Report
        </Button>
      </div>
      
      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-lg font-medium">No reports yet</p>
            <p className="text-muted-foreground mb-4">Upload your first medical report</p>
            <Button onClick={() => setUploadOpen(true)}>Upload Report</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getFileIcon(report.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(report.date)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {report.fileType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {report.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex">
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => handleViewReport(report)}
                  >
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* View Report Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentReport?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{formatDate(currentReport?.date || '')}</span>
              <span>•</span>
              <span>{currentReport?.fileType}</span>
              <span>•</span>
              <span>{currentReport?.fileSize}</span>
            </div>
            
            {currentReport?.fileType === 'PDF' ? (
              <div className="bg-muted p-4 rounded-md text-center">
                <FileText className="h-10 w-10 mx-auto mb-2 text-primary" />
                <p className="mb-3">PDF document preview</p>
                <Button asChild size="sm">
                  <a href={currentReport.url} target="_blank" rel="noopener noreferrer">
                    Open PDF
                  </a>
                </Button>
              </div>
            ) : (
              currentReport?.url && (
                <div className="rounded-md overflow-hidden bg-muted">
                  <img 
                    src={currentReport.url} 
                    alt={currentReport.title} 
                    className="max-h-[60vh] mx-auto object-contain"
                  />
                </div>
              )
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button asChild>
              <a href={currentReport?.url} download={currentReport?.title}>
                Download
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Medical Report</DialogTitle>
          </DialogHeader>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadedFile ? (
              <div className="space-y-3">
                <FileText className="h-10 w-10 mx-auto text-primary" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => setUploadedFile(null)}
                >
                  <X className="h-4 w-4" /> Remove
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">Drag & drop your file here</p>
                <p className="text-muted-foreground mb-4">Supports PDF, JPEG, and PNG (Max 10MB)</p>
                <Button asChild variant="outline">
                  <label className="cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                </Button>
              </>
            )}
          </div>
          
          {fileError && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{fileError}</span>
            </div>
          )}
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpload} disabled={!uploadedFile}>Upload Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientReports;
