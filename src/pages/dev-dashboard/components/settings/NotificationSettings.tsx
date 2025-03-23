
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NotificationSettings as NotificationSettingsType, DashboardSettings } from '../../types';

interface NotificationSettingsProps {
  notificationSettings: NotificationSettingsType;
  updateSettings: (settings: Partial<DashboardSettings>) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationSettings,
  updateSettings
}) => {
  const handleToggle = (field: keyof NotificationSettingsType) => {
    updateSettings({
      notifications: {
        ...notificationSettings,
        [field]: !notificationSettings[field]
      }
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Bell className="h-5 w-5 mr-2 text-red-500" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="buildNotifications">Build Events</Label>
            <p className="text-xs text-muted-foreground">
              Get notified about build successes and failures
            </p>
          </div>
          <Switch 
            id="buildNotifications" 
            checked={notificationSettings.buildNotifications}
            onCheckedChange={() => handleToggle('buildNotifications')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dependencyUpdates">Dependency Updates</Label>
            <p className="text-xs text-muted-foreground">
              Get notified about new package versions
            </p>
          </div>
          <Switch 
            id="dependencyUpdates" 
            checked={notificationSettings.dependencyUpdates}
            onCheckedChange={() => handleToggle('dependencyUpdates')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="securityAlerts">Security Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Get notified about security vulnerabilities
            </p>
          </div>
          <Switch 
            id="securityAlerts" 
            checked={notificationSettings.securityAlerts}
            onCheckedChange={() => handleToggle('securityAlerts')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="performanceAlerts">Performance Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Get notified about performance issues
            </p>
          </div>
          <Switch 
            id="performanceAlerts" 
            checked={notificationSettings.performanceAlerts}
            onCheckedChange={() => handleToggle('performanceAlerts')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
