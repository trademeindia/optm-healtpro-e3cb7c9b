
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const MedicalDocuments: React.FC = () => {
  const documents = [
    {
      id: '1',
      name: 'MRI Results',
      date: 'Jun 12, 2023',
      type: 'pdf',
      size: '3.5 MB',
    },
    {
      id: '2',
      name: 'Physical Therapy Plan',
      date: 'May 28, 2023',
      type: 'pdf',
      size: '1.2 MB',
    },
    {
      id: '3',
      name: 'Blood Work Analysis',
      date: 'May 15, 2023',
      type: 'pdf',
      size: '0.8 MB',
    }
  ];

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Medical Documents
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9" />
        </div>
        
        <div className="space-y-2">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{doc.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                      {doc.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button variant="link" className="w-full mt-3">
          View all documents
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicalDocuments;
