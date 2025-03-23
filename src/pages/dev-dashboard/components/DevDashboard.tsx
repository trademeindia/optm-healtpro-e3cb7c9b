
import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

interface DevDashboardProps {
  isMobile: boolean;
}

export const DevDashboard: React.FC<DevDashboardProps> = ({ isMobile }) => {
  console.log("DevDashboard rendering with isMobile:", isMobile);
  
  const [activeTab, setActiveTab] = useState('system');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const { systemStatus, runSystemCheck, lastChecked } = useSystemCheck();
  const { projectInfo, refreshProjectInfo } = useProjectInfo();
  const { dependencies, checkForUpdates } = useDependencies();
  const { performanceMetrics, refreshMetrics } = usePerformanceMetrics();
  const { settings, updateSettings } = useDevDashboardSettings();
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  
  useEffect(() => {
    console.log("DevDashboard mounted");
    toast.success("Dev Dashboard loaded successfully", {
      description: "Welcome to the developer dashboard"
    });
    
    // Log the status of each data source
    console.log("Data sources:", {
      systemStatus,
      projectInfo,
      dependencies,
      performanceMetrics
    });
    
    return () => {
      console.log("DevDashboard unmounted");
    };
  }, [systemStatus, projectInfo, dependencies, performanceMetrics]);
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background force-visible">
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden force-visible">
        <DashboardHeader 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
          systemStatus={systemStatus}
          runSystemCheck={runSystemCheck}
          lastChecked={lastChecked}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 force-visible">
          <div className={cn(
            "transition-all duration-300 ease-in-out force-visible",
            sidebarOpen ? "ml-0 md:ml-4" : "ml-0"
          )}>
            {isMobile && (
              <DashboardTabNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                systemStatus={systemStatus}
              />
            )}
            
            <Tabs defaultValue={activeTab} value={activeTab} className="mt-4 force-visible">
              <TabsContent value="system" className="mt-0 force-visible">
                <SystemCheckPanel 
                  systemStatus={systemStatus} 
                  runSystemCheck={runSystemCheck}
                  lastChecked={lastChecked}
                />
              </TabsContent>
              
              <TabsContent value="project" className="mt-0 force-visible">
                <ProjectInfoPanel 
                  projectInfo={projectInfo}
                  refreshProjectInfo={refreshProjectInfo}
                />
              </TabsContent>
              
              <TabsContent value="dependencies" className="mt-0 force-visible">
                <DependenciesPanel 
                  dependencies={dependencies}
                  checkForUpdates={checkForUpdates}
                />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-0 force-visible">
                <PerformancePanel 
                  metrics={performanceMetrics}
                  refreshMetrics={refreshMetrics}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0 force-visible">
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

export default DevDashboard;
