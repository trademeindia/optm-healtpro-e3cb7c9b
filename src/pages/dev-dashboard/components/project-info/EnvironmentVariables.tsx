
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { File, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnvVar } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnvironmentVariablesProps {
  envVars: EnvVar[];
  missingEnvVars: string[];
}

const EnvironmentVariables: React.FC<EnvironmentVariablesProps> = ({ envVars, missingEnvVars }) => {
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  
  const toggleShowValue = (name: string) => {
    setShowValues(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center">
            <File className="h-5 w-5 mr-2 text-green-500" />
            Environment Variables
          </div>
          {missingEnvVars.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {missingEnvVars.length} Missing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          {missingEnvVars.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1 font-medium">
                <AlertTriangle className="h-4 w-4" />
                <span>Missing Environment Variables</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                The following variables are required but not set:
              </p>
              <div className="flex flex-wrap gap-2">
                {missingEnvVars.map(varName => (
                  <Badge key={varName} variant="outline" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                    {varName}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {envVars.map((envVar, index) => (
            <motion.div
              key={envVar.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{envVar.name}</span>
                  {envVar.isSecret && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Secret value</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{envVar.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-mono max-w-[150px] truncate bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {envVar.isSecret && !showValues[envVar.name] ? '••••••••' : envVar.value}
                </div>
                {envVar.isSecret && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => toggleShowValue(envVar.name)}
                  >
                    {showValues[envVar.name] ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentVariables;
