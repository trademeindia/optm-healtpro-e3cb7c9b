
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MedicalDocumentsProps {
  className?: string;
}

interface Document {
  id: string;
  name: string;
  date: string;
  type: string;
  size: string;
}

const MedicalDocuments: React.FC<MedicalDocumentsProps> = ({
  className
}) => {
  // Sample documents data
  const documents: Document[] = [
    { id: '1', name: 'Medical Report', date: '2023-05-15', type: 'PDF', size: '2.4 MB' },
    { id: '2', name: 'Lab Results', date: '2023-06-22', type: 'PDF', size: '1.8 MB' },
    { id: '3', name: 'Prescription', date: '2023-07-10', type: 'PDF', size: '0.5 MB' },
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Medical Documents
        </CardTitle>
        <CardDescription>
          View and download your medical documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.date} · {doc.type} · {doc.size}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-lg">No documents yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Medical documents will appear here once added by your healthcare provider
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalDocuments;
