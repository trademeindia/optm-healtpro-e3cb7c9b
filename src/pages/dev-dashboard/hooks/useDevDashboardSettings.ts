
import { useState, useEffect } from 'react';
import { DashboardSettings } from '../types';

export function useDevDashboardSettings() {
  const [settings, setSettings] = useState<DashboardSettings>({
    autoRefresh: true,
    showVerboseLogs: false,
    showHiddenFiles: false,
    enableTips: true,
    theme: 'system',
    
    notifications: {
      buildNotifications: true,
      dependencyUpdates: true,
      securityAlerts: true,
      performanceAlerts: false
    },
    
    display: {
      showSystemCheck: true,
      showPerformance: true,
      showDependencies: true,
      defaultTab: 'system'
    }
  });

  const updateSettings = (newSettings: Partial<DashboardSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  // Load settings from localStorage on initial load
  useEffect(() => {
    const savedSettings = localStorage.getItem('devDashboardSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse saved settings', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('devDashboardSettings', JSON.stringify(settings));
  }, [settings]);

  return {
    settings,
    updateSettings
  };
}
