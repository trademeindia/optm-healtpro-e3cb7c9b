
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Download, Search, AlertCircle, Microscope, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface MedicalReportsProps {}

const MedicalReports: React.FC<MedicalReportsProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  
  // Sample medical reports data
  const reports = [
    { 
      id: '1', 
      title: 'Blood Test Results', 
      date: '2023-06-10', 
      doctor: 'Dr. Thompson',
      type: 'lab',
      findings: [
        'Hemoglobin: 14.2 g/dL (Normal)',
        'White Blood Cells: 7.5 x10^9/L (Normal)',
        'Cholesterol: 195 mg/dL (Borderline)',
        'Blood Glucose: 92 mg/dL (Normal)'
      ],
      aiInsights: 'All values within normal range. Cholesterol is slightly elevated but still within acceptable limits. Consider follow-up in 6 months.'
    },
    { 
      id: '2', 
      title: 'MRI Scan - Lower Back', 
      date: '2023-05-22', 
      doctor: 'Dr. Martinez',
      type: 'imaging',
      findings: [
        'Mild disc bulge at L4-L5',
        'No significant nerve compression',
        'Early degenerative changes noted',
        'No fractures or dislocations'
      ],
      aiInsights: 'Findings consistent with early degenerative disc disease. Physical therapy recommended. No surgical intervention needed at this time.'
    },
    { 
      id: '3', 
      title: 'Annual Physical Examination', 
      date: '2023-04-15', 
      doctor: 'Dr. Williams',
      type: 'examination',
      findings: [
        'Blood Pressure: 122/78 mmHg',
        'Heart Rate: 68 bpm',
        'BMI: 24.5 (Normal)',
        'Respiratory, Cardiovascular systems normal'
      ],
      aiInsights: 'Overall health is good. Continue with current exercise regimen. Consider increasing fiber intake based on dietary assessment.'
    },
    { 
      id: '4', 
      title: 'X-Ray - Right Knee', 
      date: '2023-03-03', 
      doctor: 'Dr. Chen',
      type: 'imaging',
      findings: [
        'No fractures or dislocations',
        'Mild joint space narrowing',
        'Small suprapatellar effusion',
        'Early osteoarthritic changes'
      ],
      aiInsights: 'Findings suggest early osteoarthritis. Recommend low-impact exercises, weight management, and possible physical therapy.'
    }
  ];

  // Filter reports based on search query
  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get active report
  const activeReport = reports.find(r => r.id === activeReportId);
  
  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reports..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button
            size="sm"
            className="flex items-center"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>
      
      {/* Reports Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Medical Reports
            </CardTitle>
            <CardDescription>
              {filteredReports.length} reports found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReports.length > 0 ? (
              <div className="space-y-3">
                {filteredReports.map(report => (
                  <div 
                    key={report.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      activeReportId === report.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setActiveReportId(report.id)}
                  >
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium text-sm">{report.title}</h3>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        report.type === 'lab' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        report.type === 'imaging' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {report.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(report.date), 'MMM d, yyyy')}
                      </span>
                      <span>{report.doctor}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>No reports found matching "{searchQuery}"</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Report Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {activeReport ? activeReport.title : 'Report Details'}
            </CardTitle>
            {activeReport && (
              <CardDescription>
                {format(new Date(activeReport.date), 'MMMM d, yyyy')} • {activeReport.doctor}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {activeReport ? (
              <Tabs defaultValue="findings">
                <TabsList className="mb-4">
                  <TabsTrigger value="findings">Findings</TabsTrigger>
                  <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="findings">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Microscope className="h-4 w-4 mr-1 text-primary" />
                        Key Findings
                      </h3>
                      <ul className="space-y-2">
                        {activeReport.findings.map((finding, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="bg-primary/10 text-primary font-medium rounded-full h-5 w-5 inline-flex items-center justify-center mr-2 flex-shrink-0">
                              {idx + 1}
                            </span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Document Preview</h3>
                      <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30">
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Preview not available</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai">
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950/20 dark:border-blue-800">
                      <h3 className="text-sm font-medium flex items-center text-blue-800 dark:text-blue-300 mb-2">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        AI Generated Analysis
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        {activeReport.aiInsights}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Related Biomarkers</h3>
                      {activeReport.type === 'lab' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="border rounded-md p-3">
                            <div className="text-xs text-muted-foreground mb-1">Hemoglobin</div>
                            <div className="text-sm font-medium">14.2 g/dL</div>
                            <div className="text-xs text-green-600 mt-1">Normal range (13.5-17.5)</div>
                          </div>
                          <div className="border rounded-md p-3">
                            <div className="text-xs text-muted-foreground mb-1">Cholesterol</div>
                            <div className="text-sm font-medium">195 mg/dL</div>
                            <div className="text-xs text-amber-600 mt-1">Borderline (190-200)</div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No specific biomarkers associated with this report type.
                        </p>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Recommended Actions</h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="bg-green-100 p-1 rounded-full mr-2 dark:bg-green-900/30">
                            <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-sm">
                            {activeReport.type === 'lab' ? 'Schedule follow-up blood work in 6 months' : 
                             activeReport.type === 'imaging' ? 'Begin recommended physical therapy program' :
                             'Continue current health maintenance plan'}
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-1 rounded-full mr-2 dark:bg-blue-900/30">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-sm">
                            Share this report with your specialist
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="font-medium mb-1">No report selected</h3>
                <p className="text-sm max-w-md">
                  Select a report from the list to view details or upload a new medical report to analyze.
                </p>
              </div>
            )}
          </CardContent>
          {activeReport && (
            <CardFooter className="border-t pt-4 justify-between">
              <div className="text-sm text-muted-foreground">
                Added to health record on {format(new Date(activeReport.date), 'MMM d, yyyy')}
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Medical Report</DialogTitle>
            <DialogDescription>
              Upload a new medical report to analyze with AI and add to your records.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="report-title">Report Title</Label>
              <Input id="report-title" placeholder="e.g., Blood Test Results" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <select 
                id="report-type" 
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="lab">Lab Results</option>
                <option value="imaging">Imaging (X-Ray, MRI, CT)</option>
                <option value="examination">Physical Examination</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-date">Report Date</Label>
              <Input id="report-date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
              <p className="text-xs text-muted-foreground mb-3">Supports PDF, JPG, PNG (max 10MB)</p>
              <Button size="sm">
                Browse Files
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUploadDialogOpen(false)}>
              Upload & Analyze
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalReports;
