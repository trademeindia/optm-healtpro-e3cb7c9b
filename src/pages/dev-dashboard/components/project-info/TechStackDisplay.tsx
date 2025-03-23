
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechStackItem } from '../../types';
import { Package } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TechStackDisplayProps {
  techStack: TechStackItem[];
}

const TechStackDisplay: React.FC<TechStackDisplayProps> = ({ techStack }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Package className="h-5 w-5 mr-2 text-indigo-500" />
          Tech Stack
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-help"
                    >
                      {tech.icon && (
                        <div 
                          className="text-xl mb-2" 
                          dangerouslySetInnerHTML={{ __html: tech.icon }} 
                        />
                      )}
                      <span className="text-sm font-medium">{tech.name}</span>
                      <span className="text-xs text-muted-foreground">{tech.version}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-medium">{tech.name} {tech.version}</p>
                    <p className="text-xs mt-1">{tech.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default TechStackDisplay;
