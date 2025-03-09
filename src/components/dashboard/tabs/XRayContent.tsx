
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const XRayContent: React.FC = () => {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">All imaging studies for this patient</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border rounded-lg overflow-hidden"
        >
          <div className="h-40 bg-gray-100 flex items-center justify-center">
            <img 
              src="/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png" 
              alt="Shoulder X-Ray" 
              className="max-h-full object-cover" 
            />
          </div>
          <div className="p-3">
            <h4 className="font-medium">Left Shoulder X-Ray</h4>
            <p className="text-xs text-muted-foreground">Jun 5, 2023</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">X-Ray</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="border rounded-lg overflow-hidden"
        >
          <div className="h-40 bg-gray-100 flex items-center justify-center">
            <img 
              src="/lovable-uploads/b60c3153-1d31-447c-a492-29234c29898a.png" 
              alt="MRI Shoulder" 
              className="max-h-full object-cover" 
            />
          </div>
          <div className="p-3">
            <h4 className="font-medium">MRI Left Shoulder</h4>
            <p className="text-xs text-muted-foreground">Jun 7, 2023</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">MRI</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default XRayContent;
