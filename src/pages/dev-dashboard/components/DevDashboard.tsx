
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardHeader from './DashboardHeader';
import SystemCheckPanel from './system-check/SystemCheckPanel';
import ProjectInfoPanel from './project-info/ProjectInfoPanel';
import DependenciesPanel from './dependencies/DependenciesPanel';
import PerformancePanel from './performance/PerformancePanel';
import DashboardSidebar from './DashboardSidebar';
import DashboardTabNav from './DashboardTabNav';
import { useSystemCheck } from '../hooks/useSystemCheck';
import { useProjectInfo } from '../hooks/useProjectInfo';
import { useDependencies } from '../hooks/useDependencies';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { useDevDashboardSettings } from '../hooks/useDevDashboardSettings';
import SettingsPanel from './settings/SettingsPanel';

interface DevDashboardProps {
  isMobile: boolean;
}

export const DevDashboard: React.FC<DevDashboardProps> = ({ isMobile }) => {
  const [activeTab, setActiveTab] = useState('system');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const { systemStatus, runSystemCheck, lastChecked } = useSystemCheck();
  const { projectInfo, refreshProjectInfo } = useProjectInfo();
  const { dependencies, checkForUpdates } = useDependencies();
  const { performanceMetrics, refreshMetrics } = usePerformanceMetrics();
  const { settings, updateSettings } = useDevDashboardSettings();
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
          systemStatus={systemStatus}
          runSystemCheck={runSystemCheck}
          lastChecked={lastChecked}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            sidebarOpen ? "ml-0 md:ml-4" : "ml-0"
          )}>
            {isMobile && (
              <DashboardTabNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                systemStatus={systemStatus}
              />
            )}
            
            <Tabs value={activeTab} className="mt-4">
              <TabsContent value="system" className="mt-0">
                <SystemCheckPanel 
                  systemStatus={systemStatus} 
                  runSystemCheck={runSystemCheck}
                  lastChecked={lastChecked}
                />
              </TabsContent>
              
              <TabsContent value="project" className="mt-0">
                <ProjectInfoPanel 
                  projectInfo={projectInfo}
                  refreshProjectInfo={refreshProjectInfo}
                />
              </TabsContent>
              
              <TabsContent value="dependencies" className="mt-0">
                <DependenciesPanel 
                  dependencies={dependencies}
                  checkForUpdates={checkForUpdates}
                />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-0">
                <PerformancePanel 
                  metrics={performanceMetrics}
                  refreshMetrics={refreshMetrics}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <SettingsPanel 
                  settings={settings}
                  updateSettings={updateSettings}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
