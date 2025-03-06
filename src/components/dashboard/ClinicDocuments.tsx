
import React from 'react';
import { FileText, Upload, Search, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

interface ClinicDocumentsProps {
  documents: Document[];
  className?: string;
  onUpload?: () => void;
  onViewAll?: () => void;
}

const ClinicDocuments: React.FC<ClinicDocumentsProps> = ({
  documents,
  className,
  onUpload,
  onViewAll,
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Clinic Documents</CardTitle>
            <CardDescription>
              Recent files and medical records
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onUpload}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9 bg-white dark:bg-gray-800/50"
          />
        </div>
        
        <div className="space-y-2">
          {documents.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No documents found</p>
          ) : (
            documents.slice(0, 5).map((document) => (
              <div 
                key={document.id} 
                className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{document.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{document.type}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{document.date}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{document.size}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        {documents.length > 5 && (
          <Button variant="ghost" className="w-full mt-4" onClick={onViewAll}>
            View All Documents
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ClinicDocuments;
