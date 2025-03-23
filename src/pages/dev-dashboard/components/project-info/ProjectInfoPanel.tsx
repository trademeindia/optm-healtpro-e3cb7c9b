
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ProjectInfo } from '../../types';
import ProjectStructureTree from './ProjectStructureTree';
import TechStackDisplay from './TechStackDisplay';
import ScriptsDisplay from './ScriptsDisplay';
import EnvironmentVariables from './EnvironmentVariables';

interface ProjectInfoPanelProps {
  projectInfo: ProjectInfo;
  refreshProjectInfo: () => void;
}

const ProjectInfoPanel: React.FC<ProjectInfoPanelProps> = ({
  projectInfo,
  refreshProjectInfo
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Information</h2>
          <p className="text-muted-foreground">
            Overview of project structure, configuration, and key details
          </p>
        </div>
        
        <Button onClick={refreshProjectInfo} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Info
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Project Name</h3>
            <p className="text-lg font-bold">{projectInfo.name}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Version</h3>
            <p className="text-lg font-bold">{projectInfo.version}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Last Updated</h3>
            <p className="text-lg font-bold">{projectInfo.lastUpdated}</p>
          </div>
        </div>
        
        <div>
          <TechStackDisplay techStack={projectInfo.techStack} />
        </div>
        
        <div>
          <ScriptsDisplay scripts={projectInfo.scripts} />
        </div>
        
        <div className="md:col-span-1">
          <EnvironmentVariables 
            envVars={projectInfo.environmentVariables} 
            missingEnvVars={projectInfo.missingEnvVars}
          />
        </div>
        
        <div className="md:col-span-1">
          <ProjectStructureTree fileStructure={projectInfo.fileStructure} />
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectInfoPanel;
