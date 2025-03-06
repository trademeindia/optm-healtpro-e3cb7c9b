
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, File, FilePlus, Upload, Download, Search,
  Filter, ChevronDown, Calendar, Clock, User, 
  MoreHorizontal, Printer, Share2, Trash2
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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
  const reports = [
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
    }
  ];

  const handleUploadDocument = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded.",
    });
    setShowUploadDialog(false);
  };

  const handleCreateReport = () => {
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

  const handleDeleteReport = (id: string, name: string) => {
    toast({
      title: "Report Deleted",
      description: `${name} has been deleted`,
      variant: "destructive"
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
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
                                      onClick={() => handleDeleteReport(report.id, report.name)}
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
      
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload medical reports, X-rays, or other documents for the patient.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag files here or click to upload</p>
              <p className="text-xs text-muted-foreground mb-4">
                Supports PDF, JPEG, PNG files up to 10MB
              </p>
              <Button size="sm">Select Files</Button>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm font-medium">Document Details</div>
              
              <div className="space-y-2">
                <label className="text-sm">Document Name</label>
                <Input placeholder="e.g., X-Ray Report - Left Shoulder" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Document Type</label>
                <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <option>Imaging</option>
                  <option>Lab Report</option>
                  <option>Clinical Notes</option>
                  <option>Diagnostic</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Patient</label>
                <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <option>Nikolas Pascal</option>
                  <option>Emma Rodriguez</option>
                  <option>Marcus Johnson</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Date</label>
                <Input type="date" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>
              Upload Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Create a new medical report or clinical notes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Title</label>
              <Input placeholder="e.g., Clinical Follow-up Notes" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <option>Clinical Notes</option>
                <option>Diagnostic Report</option>
                <option>Treatment Plan</option>
                <option>Progress Notes</option>
                <option>Discharge Summary</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <option>Nikolas Pascal</option>
                <option>Emma Rodriguez</option>
                <option>Marcus Johnson</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea 
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[150px]"
                placeholder="Enter the report content here..."
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Attach Files (Optional)</label>
              <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Attach Files
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport}>
              Create Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;
