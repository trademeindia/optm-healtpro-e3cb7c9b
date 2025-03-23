
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun, Monitor } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ThemeSelectorProps {
  currentTheme: 'light' | 'dark' | 'system';
  onChange: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onChange }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Sun className="h-5 w-5 mr-2 text-amber-500" />
          Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentTheme}
          onValueChange={(value) => onChange(value as 'light' | 'dark' | 'system')}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="light"
              id="theme-light"
              className="peer sr-only"
            />
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Sun className="h-6 w-6 mb-3 text-amber-500" />
              <div className="font-medium">Light</div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem
              value="dark"
              id="theme-dark"
              className="peer sr-only"
            />
            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gray-950 p-4 hover:bg-gray-900 hover:border-gray-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Moon className="h-6 w-6 mb-3 text-indigo-400" />
              <div className="font-medium text-white">Dark</div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem
              value="system"
              id="theme-system"
              className="peer sr-only"
            />
            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-white to-gray-950 p-4 hover:border-gray-400 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Monitor className="h-6 w-6 mb-3 text-purple-500" />
              <div className="font-medium text-gray-700">System</div>
            </Label>
          </div>
        </RadioGroup>
        
        <p className="text-xs text-muted-foreground mt-4">
          Choose a theme for your dashboard. System default will follow your device settings.
        </p>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
