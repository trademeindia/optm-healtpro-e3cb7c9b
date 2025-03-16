
import React from 'react';
import { MedicalReport, MedicalAnalysis } from '@/types/medicalData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { FileText, FileCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportsHistoryProps {
  reports: MedicalReport[];
  analyses: MedicalAnalysis[];
}

const ReportsHistory: React.FC<ReportsHistoryProps> = ({ reports, analyses }) => {
  if (reports.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No reports available. Upload medical reports to see them here.
        </div>
      </Card>
    );
  }

  // Sort reports by date (newest first)
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-background p-4">
          <CardTitle className="text-md font-medium">Medical Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {sortedReports.map((report) => {
              const analysis = analyses.find(a => a.reportId === report.id);
              
              return (
                <div key={report.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="pt-1">
                      {report.analyzed ? (
                        <FileCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)} Report
                        {report.fileName && ` - ${report.fileName}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(report.timestamp), "MMMM d, yyyy")}
                      </p>
                      
                      {analysis && (
                        <div className="mt-2 bg-muted/30 p-2 rounded text-sm">
                          <p className="font-medium">Analysis Summary:</p>
                          <p className="text-muted-foreground">{analysis.summary}</p>
                          
                          {analysis.keyFindings && analysis.keyFindings.length > 0 && (
                            <div className="mt-1">
                              <p className="text-xs text-muted-foreground">Key findings:</p>
                              <ul className="list-disc list-inside text-xs mt-1">
                                {analysis.keyFindings.slice(0, 2).map((finding, index) => (
                                  <li key={index}>{finding}</li>
                                ))}
                                {analysis.keyFindings.length > 2 && (
                                  <li>...</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsHistory;
