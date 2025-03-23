
import { useState, useEffect } from 'react';
import { SystemStatus } from '../types';

export function useSystemCheck() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({});
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runSystemCheck = () => {
    // In a real implementation, this would make actual checks of the system
    // For demo purposes, we'll simulate system checks with a mix of statuses
    
    setSystemStatus({
      node: {
        status: 'success',
        message: 'Node.js v18.12.1 is properly installed',
        details: [
          'Using recommended LTS version',
          'All required Node.js APIs are available'
        ]
      },
      npm: {
        status: 'success',
        message: 'npm v9.2.0 is properly configured',
        details: [
          'Package manager working correctly',
          'npm registry is accessible'
        ]
      },
      typescript: {
        status: 'success',
        message: 'TypeScript v4.9.4 is installed',
        details: [
          'Compiler working properly',
          'TSConfig is valid'
        ]
      },
      react: {
        status: 'success',
        message: 'React v18.2.0 is properly installed',
        details: [
          'Using latest stable version',
          'All React dependencies are compatible'
        ]
      },
      babel: {
        status: 'warning',
        message: 'Babel configuration contains deprecated options',
        details: [
          '@babel/preset-env targets should be updated',
          'Consider upgrading to latest Babel version'
        ]
      },
      eslint: {
        status: 'success',
        message: 'ESLint v8.31.0 is properly configured',
        details: [
          'Using recommended rule sets',
          'No conflicting rules detected'
        ]
      },
      git: {
        status: 'error',
        message: 'Git LFS is not properly configured',
        details: [
          'Large files detected but Git LFS is not installed',
          'Install Git LFS: git lfs install',
          'Then track large files: git lfs track "*.psd"'
        ]
      },
      bundler: {
        status: 'success',
        message: 'Webpack v5.75.0 is properly configured',
        details: [
          'All loaders are working correctly',
          'Build process is optimized'
        ]
      }
    });
    
    setLastChecked(new Date());
  };

  // Run system check on initial load
  useEffect(() => {
    runSystemCheck();
  }, []);

  return {
    systemStatus,
    runSystemCheck,
    lastChecked
  };
}
