
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DisplaySettings as DisplaySettingsType, DashboardSettings } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DisplaySettingsProps {
  displaySettings: DisplaySettingsType;
  updateSettings: (settings: Partial<DashboardSettings>) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  displaySettings,
  updateSettings
}) => {
  const handleToggle = (field: keyof DisplaySettingsType) => {
    updateSettings({
      display: {
        ...displaySettings,
        [field]: !displaySettings[field]
      }
    });
  };
  
  const handleSelectChange = (field: keyof DisplaySettingsType, value: string) => {
    updateSettings({
      display: {
        ...displaySettings,
        [field]: value
      }
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Eye className="h-5 w-5 mr-2 text-emerald-500" />
          Display Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showSystemCheck">System Check Panel</Label>
            <p className="text-xs text-muted-foreground">
              Show system status on dashboard
            </p>
          </div>
          <Switch 
            id="showSystemCheck" 
            checked={displaySettings.showSystemCheck}
            onCheckedChange={() => handleToggle('showSystemCheck')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showPerformance">Performance Metrics</Label>
            <p className="text-xs text-muted-foreground">
              Show performance graphs and statistics
            </p>
          </div>
          <Switch 
            id="showPerformance" 
            checked={displaySettings.showPerformance}
            onCheckedChange={() => handleToggle('showPerformance')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showDependencies">Dependencies Panel</Label>
            <p className="text-xs text-muted-foreground">
              Show package dependencies information
            </p>
          </div>
          <Switch 
            id="showDependencies" 
            checked={displaySettings.showDependencies}
            onCheckedChange={() => handleToggle('showDependencies')}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="defaultTab">Default Dashboard Tab</Label>
            <Select 
              value={displaySettings.defaultTab} 
              onValueChange={(value) => handleSelectChange('defaultTab', value)}
            >
              <SelectTrigger id="defaultTab">
                <SelectValue placeholder="Select default tab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System Check</SelectItem>
                <SelectItem value="project">Project Info</SelectItem>
                <SelectItem value="dependencies">Dependencies</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose which tab is displayed when opening the dashboard
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplaySettings;
