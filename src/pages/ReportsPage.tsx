
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, File, FilePlus, Upload, Download, Search,
  Filter, ChevronDown, Calendar, Clock, User, 
  MoreHorizontal, Printer, Share2, Trash2, Pen, AlertTriangle, X
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  uploadedBy: string;
  patient: string;
  patientId: string;
  size: string;
  thumbnailUrl: string | null;
  content?: string;
}

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    type: string;
    date: string;
    patient: string;
    content?: string;
  }>({
    name: '',
    type: '',
    date: '',
    patient: '',
    content: '',
  });
  const { toast } = useToast();

  // Sample report categories
  const categories = [
    { id: "all", label: "All Reports" },
    { id: "clinical", label: "Clinical Notes" },
    { id: "diagnostic", label: "Diagnostic" },
    { id: "lab", label: "Lab Reports" },
    { id: "imaging", label: "Imaging" }
  ];
  
  // Sample report data
  const [reports, setReports] = useState<Report[]>([
    {
      id: "doc1",
      name: "X-Ray Report - Left Shoulder",
      type: "imaging",
      date: "Jun 5, 2023",
      uploadedBy: "Dr. Smith",
      patient: "Nikolas Pascal",
      patientId: "PT-1001",
      size: "2.4 MB",
      thumbnailUrl: "/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png",
      content: "Patient presents with calcification in the left shoulder. Recommend physical therapy and anti-inflammatory medication."
    },
    {
      id: "doc2",
      name: "MRI Report - Shoulder",
      type: "imaging",
      date: "Jun 7, 2023",
      uploadedBy: "Dr. Johnson",
      patient: "Nikolas Pascal",
      patientId: "PT-1001",
      size: "3.8 MB",
      thumbnailUrl: "/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png",
      content: "MRI shows minor tear in the rotator cuff. Surgery may be required if conservative treatment fails."
    },
    {
      id: "doc3",
      name: "Blood Test Results",
      type: "lab",
      date: "Jun 10, 2023",
      uploadedBy: "Dr. Wilson",
      patient: "Emma Rodriguez",
      patientId: "PT-1002",
      size: "1.2 MB",
      thumbnailUrl: null,
      content: "All blood markers within normal range. No signs of inflammation or infection."
    },
    {
      id: "doc4",
      name: "Treatment Plan - Phase 1",
      type: "clinical",
      date: "Jun 12, 2023",
      uploadedBy: "Dr. Smith",
      patient: "Marcus Johnson",
      patientId: "PT-1003",
      size: "0.8 MB",
      thumbnailUrl: null,
      content: "6-week rehabilitation program focusing on strengthening exercises and gradual return to sports activities."
    },
    {
      id: "doc5",
      name: "ECG Report",
      type: "diagnostic",
      date: "Jun 15, 2023",
      uploadedBy: "Dr. Johnson",
      patient: "Emma Rodriguez",
      patientId: "PT-1002",
      size: "1.5 MB",
      thumbnailUrl: null,
      content: "Normal sinus rhythm. No abnormalities detected."
    },
    {
      id: "doc6",
      name: "Physical Therapy Progress Notes",
      type: "clinical",
      date: "Jun 18, 2023",
      uploadedBy: "Dr. Wilson",
      patient: "Nikolas Pascal",
      patientId: "PT-1001",
      size: "0.5 MB",
      thumbnailUrl: null,
      content: "Patient showing good progress. Range of motion has improved by 15 degrees since initial assessment."
    }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size exceeds 10MB limit");
        return;
      }
      
      // Check file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setUploadError("File type not supported. Please upload PDF, JPEG, or PNG files");
        return;
      }
      
      setFileToUpload(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, show a generic icon or text
        setFilePreview(null);
      }
    }
  };

  const handleUploadDocument = () => {
    // Here you would typically upload to a server
    // For this demo, we'll just add it to our local state
    
    const uploadForm = document.getElementById('uploadForm') as HTMLFormElement;
    const formData = new FormData(uploadForm);
    
    const name = formData.get('documentName') as string;
    const type = formData.get('documentType') as string;
    const patient = formData.get('patient') as string;
    const date = formData.get('date') as string;
    
    if (!name || !type || !patient || !date || !fileToUpload) {
      setUploadError("Please fill in all required fields");
      return;
    }
    
    // Create a new report object
    const newReport: Report = {
      id: `doc${reports.length + 1}`,
      name,
      type,
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      uploadedBy: "Current Doctor", // In a real app, this would be the logged-in user
      patient,
      patientId: "PT-1004", // In a real app, this would be looked up
      size: `${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB`,
      thumbnailUrl: filePreview,
      content: "New document content would be extracted or entered here."
    };
    
    // Add to reports array
    setReports([...reports, newReport]);
    
    toast({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded.",
    });
    
    // Reset form state
    setShowUploadDialog(false);
    setFileToUpload(null);
    setFilePreview(null);
    setUploadError(null);
  };

  const handleEditReport = () => {
    if (!selectedReport) return;
    
    // Update the report in our local state
    const updatedReports = reports.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          name: editFormData.name,
          type: editFormData.type,
          date: editFormData.date,
          patient: editFormData.patient,
          content: editFormData.content
        };
      }
      return report;
    });
    
    setReports(updatedReports);
    
    toast({
      title: "Report Updated",
      description: "The report has been successfully updated.",
    });
    
    // Close dialog and reset form
    setShowEditDialog(false);
    setSelectedReport(null);
  };

  const handleOpenEditDialog = (report: Report) => {
    setSelectedReport(report);
    setEditFormData({
      name: report.name,
      type: report.type,
      date: report.date,
      patient: report.patient,
      content: report.content || ''
    });
    setShowEditDialog(true);
  };

  const handleOpenDeleteDialog = (report: Report) => {
    setSelectedReport(report);
    setShowDeleteDialog(true);
  };

  const handleDeleteReport = () => {
    if (!selectedReport) return;
    
    // Remove the report from our local state
    const updatedReports = reports.filter(report => report.id !== selectedReport.id);
    setReports(updatedReports);
    
    toast({
      title: "Report Deleted",
      description: `${selectedReport.name} has been deleted`,
      variant: "destructive"
    });
    
    // Close dialog and reset selection
    setShowDeleteDialog(false);
    setSelectedReport(null);
  };

  const handleCreateReport = () => {
    // Get form data from the create report form
    const createForm = document.getElementById('createReportForm') as HTMLFormElement;
    const formData = new FormData(createForm);
    
    const title = formData.get('reportTitle') as string;
    const type = formData.get('reportType') as string;
    const patient = formData.get('patient') as string;
    const content = formData.get('content') as string;
    
    if (!title || !type || !patient || !content) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new report
    const newReport: Report = {
      id: `doc${reports.length + 1}`,
      name: title,
      type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      uploadedBy: "Current Doctor", // In a real app, this would be the logged-in user
      patient,
      patientId: "PT-1004", // In a real app, this would be looked up
      size: "0.1 MB",
      thumbnailUrl: null,
      content
    };
    
    // Add to reports array
    setReports([...reports, newReport]);
    
    toast({
      title: "Report Created",
      description: "Your new report has been created.",
    });
    
    setShowCreateDialog(false);
  };

  const handleDownloadReport = (id: string, name: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${name}`,
    });
  };

  const handlePrintReport = (id: string, name: string) => {
    toast({
      title: "Print Job Sent",
      description: `Printing ${name}`,
    });
  };

  const handleShareReport = (id: string, name: string) => {
    toast({
      title: "Share Options",
      description: `Sharing options for ${name}`,
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Reports & Documents</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage patient reports, medical records and documentation
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search reports..." 
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <Button 
                  className="gap-1.5" 
                  onClick={() => setShowCreateDialog(true)}
                >
                  <FilePlus className="h-4 w-4" />
                  <span className="hidden md:inline">New Report</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-1.5"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden md:inline">Upload</span>
                </Button>
              </div>
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="rounded-md">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-semibold">{category.label}</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Filter className="h-3 w-3" />
                          <span className="hidden sm:inline">Filter</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          <span className="hidden sm:inline">Export</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">NAME</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">PATIENT</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">TYPE</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">DATE</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">UPLOADED BY</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">SIZE</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports
                            .filter(report => category.id === "all" || report.type === category.id)
                            .map(report => (
                              <tr key={report.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                      {report.thumbnailUrl ? (
                                        <img src={report.thumbnailUrl} alt={report.name} className="w-10 h-10 object-cover rounded" />
                                      ) : (
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    <span className="font-medium text-sm">{report.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="text-sm">{report.patient}</div>
                                  <div className="text-xs text-muted-foreground">{report.patientId}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                    report.type === 'imaging' 
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' 
                                      : report.type === 'lab'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                        : report.type === 'clinical'
                                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                  }`}>
                                    {report.type}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm">{report.date}</td>
                                <td className="py-3 px-4 text-sm">{report.uploadedBy}</td>
                                <td className="py-3 px-4 text-sm">{report.size}</td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8"
                                      onClick={() => handleDownloadReport(report.id, report.name)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8"
                                      onClick={() => handlePrintReport(report.id, report.name)}
                                    >
                                      <Printer className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8"
                                      onClick={() => handleShareReport(report.id, report.name)}
                                    >
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                    
                                    {/* Edit button */}
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/10"
                                      onClick={() => handleOpenEditDialog(report)}
                                    >
                                      <Pen className="h-4 w-4" />
                                    </Button>
                                    
                                    {/* Delete button */}
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
                                      onClick={() => handleOpenDeleteDialog(report)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload medical reports, X-rays, or other documents for the patient.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <form id="uploadForm" className="space-y-4">
              <div 
                className={`border-2 border-dashed ${uploadError ? 'border-red-400 bg-red-50' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 text-center relative overflow-hidden`}
              >
                {filePreview && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                    <img src={filePreview} alt="Preview" className="max-h-32 max-w-full object-contain" />
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setFilePreview(null);
                        setFileToUpload(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div className={filePreview ? 'opacity-0' : ''}>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Drag files here or click to upload</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supports PDF, JPEG, PNG files up to 10MB
                  </p>
                  
                  <label htmlFor="file-upload">
                    <Button size="sm" className="cursor-pointer" asChild>
                      <span>Select Files</span>
                    </Button>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                
                {uploadError && (
                  <div className="mt-3 text-sm text-red-500 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {uploadError}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium">Document Details</div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentName">Document Name*</Label>
                  <Input 
                    id="documentName"
                    name="documentName" 
                    placeholder="e.g., X-Ray Report - Left Shoulder" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type*</Label>
                  <select 
                    id="documentType"
                    name="documentType" 
                    className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    required
                  >
                    <option value="">Select document type</option>
                    <option value="imaging">Imaging</option>
                    <option value="lab">Lab Report</option>
                    <option value="clinical">Clinical Notes</option>
                    <option value="diagnostic">Diagnostic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient*</Label>
                  <select 
                    id="patient"
                    name="patient" 
                    className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    required
                  >
                    <option value="">Select patient</option>
                    <option value="Nikolas Pascal">Nikolas Pascal</option>
                    <option value="Emma Rodriguez">Emma Rodriguez</option>
                    <option value="Marcus Johnson">Marcus Johnson</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date*</Label>
                  <Input 
                    id="date"
                    name="date" 
                    type="date" 
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </form>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadDocument}
              disabled={!fileToUpload || !!uploadError}
            >
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Report Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Create a new medical report or clinical notes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <form id="createReportForm" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Report Title*</Label>
                <Input 
                  id="reportTitle"
                  name="reportTitle"
                  placeholder="e.g., Clinical Follow-up Notes" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type*</Label>
                <select 
                  id="reportType"
                  name="reportType"
                  className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  required
                >
                  <option value="">Select report type</option>
                  <option value="clinical">Clinical Notes</option>
                  <option value="diagnostic">Diagnostic Report</option>
                  <option value="lab">Treatment Plan</option>
                  <option value="imaging">Progress Notes</option>
                  <option value="diagnostic">Discharge Summary</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportPatient">Patient*</Label>
                <select 
                  id="reportPatient"
                  name="patient"
                  className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  required
                >
                  <option value="">Select patient</option>
                  <option value="Nikolas Pascal">Nikolas Pascal</option>
                  <option value="Emma Rodriguez">Emma Rodriguez</option>
                  <option value="Marcus Johnson">Marcus Johnson</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportContent">Content*</Label>
                <Textarea 
                  id="reportContent"
                  name="content"
                  className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[150px]"
                  placeholder="Enter the report content here..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attachments">Attach Files (Optional)</Label>
                <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                  <Button size="sm" variant="outline" asChild>
                    <label htmlFor="report-attachments" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Attach Files
                      <input 
                        id="report-attachments" 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </form>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport}>
              Create Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Report Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>
              Update the report information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editReportName">Report Name</Label>
              <Input 
                id="editReportName"
                value={editFormData.name} 
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editReportType">Report Type</Label>
              <select 
                id="editReportType"
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={editFormData.type}
                onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
              >
                <option value="imaging">Imaging</option>
                <option value="lab">Lab Report</option>
                <option value="clinical">Clinical Notes</option>
                <option value="diagnostic">Diagnostic</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editReportPatient">Patient</Label>
              <select 
                id="editReportPatient"
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={editFormData.patient}
                onChange={(e) => setEditFormData({...editFormData, patient: e.target.value})}
              >
                <option value="Nikolas Pascal">Nikolas Pascal</option>
                <option value="Emma Rodriguez">Emma Rodriguez</option>
                <option value="Marcus Johnson">Marcus Johnson</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editReportDate">Date</Label>
              <Input 
                id="editReportDate"
                type="text" 
                value={editFormData.date}
                onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editReportContent">Content</Label>
              <Textarea 
                id="editReportContent"
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[150px]"
                value={editFormData.content}
                onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditReport}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedReport?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReport}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReportsPage;
