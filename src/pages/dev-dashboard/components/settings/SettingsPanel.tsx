
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Eye, Moon, Sun, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DashboardSettings } from '../../types';
import ThemeSelector from './ThemeSelector';
import NotificationSettings from './NotificationSettings';
import DisplaySettings from './DisplaySettings';

interface SettingsPanelProps {
  settings: DashboardSettings;
  updateSettings: (settings: Partial<DashboardSettings>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  updateSettings
}) => {
  const handleToggle = (field: keyof DashboardSettings) => {
    updateSettings({
      [field]: !settings[field]
    });
  };
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Settings</h2>
          <p className="text-muted-foreground">
            Customize your development environment dashboard experience
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-500" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoRefresh">Auto Refresh</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically refresh dashboard data
                  </p>
                </div>
                <Switch 
                  id="autoRefresh" 
                  checked={settings.autoRefresh}
                  onCheckedChange={() => handleToggle('autoRefresh')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showVerboseLogs">Show Verbose Logs</Label>
                  <p className="text-xs text-muted-foreground">
                    Display detailed system logs
                  </p>
                </div>
                <Switch 
                  id="showVerboseLogs" 
                  checked={settings.showVerboseLogs}
                  onCheckedChange={() => handleToggle('showVerboseLogs')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showHiddenFiles">Show Hidden Files</Label>
                  <p className="text-xs text-muted-foreground">
                    Display hidden files in project structure
                  </p>
                </div>
                <Switch 
                  id="showHiddenFiles" 
                  checked={settings.showHiddenFiles}
                  onCheckedChange={() => handleToggle('showHiddenFiles')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableTips">Show Pro Tips</Label>
                  <p className="text-xs text-muted-foreground">
                    Display development tips and suggestions
                  </p>
                </div>
                <Switch 
                  id="enableTips" 
                  checked={settings.enableTips}
                  onCheckedChange={() => handleToggle('enableTips')}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ThemeSelector currentTheme={settings.theme} onChange={handleThemeChange} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <NotificationSettings 
            notificationSettings={settings.notifications}
            updateSettings={updateSettings}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <DisplaySettings 
            displaySettings={settings.display}
            updateSettings={updateSettings}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPanel;
