
import { useState, useEffect } from 'react';
import { Dependencies } from '../types';

export function useDependencies() {
  const [dependencies, setDependencies] = useState<Dependencies>({
    packages: [
      {
        name: 'react',
        currentVersion: '18.3.1',
        latestVersion: '18.3.1',
        isDev: false,
        isOutdated: false,
        vulnerabilities: []
      },
      {
        name: 'react-dom',
        currentVersion: '18.3.1',
        latestVersion: '18.3.1',
        isDev: false,
        isOutdated: false,
        vulnerabilities: []
      },
      {
        name: 'next',
        currentVersion: '13.4.7',
        latestVersion: '14.0.0',
        isDev: false,
        isOutdated: true,
        vulnerabilities: []
      },
      {
        name: 'typescript',
        currentVersion: '4.9.5',
        latestVersion: '5.1.6',
        isDev: true,
        isOutdated: true,
        vulnerabilities: []
      },
      {
        name: 'tailwindcss',
        currentVersion: '3.3.2',
        latestVersion: '3.3.3',
        isDev: true,
        isOutdated: true,
        vulnerabilities: []
      },
      {
        name: 'eslint',
        currentVersion: '8.31.0',
        latestVersion: '8.31.0',
        isDev: true,
        isOutdated: false,
        vulnerabilities: []
      },
      {
        name: 'jest',
        currentVersion: '29.5.0',
        latestVersion: '29.6.2',
        isDev: true,
        isOutdated: true,
        vulnerabilities: []
      },
      {
        name: 'postcss',
        currentVersion: '8.4.14',
        latestVersion: '8.4.14',
        isDev: true,
        isOutdated: false,
        vulnerabilities: []
      },
      {
        name: 'framer-motion',
        currentVersion: '10.16.4',
        latestVersion: '10.16.4',
        isDev: false,
        isOutdated: false,
        vulnerabilities: []
      },
      {
        name: 'axios',
        currentVersion: '1.4.0',
        latestVersion: '1.4.0',
        isDev: false,
        isOutdated: false,
        vulnerabilities: [
          {
            severity: 'moderate',
            description: 'Server-Side Request Forgery (SSRF) vulnerability in redirects'
          }
        ]
      },
      {
        name: 'lodash',
        currentVersion: '4.17.20',
        latestVersion: '4.17.21',
        isDev: false,
        isOutdated: true,
        vulnerabilities: [
          {
            severity: 'high',
            description: 'Prototype Pollution in lodash versions before 4.17.21'
          }
        ]
      },
      {
        name: 'moment',
        currentVersion: '2.29.1',
        latestVersion: '2.29.4',
        isDev: false,
        isOutdated: true,
        vulnerabilities: [
          {
            severity: 'critical',
            description: 'Regular Expression Denial of Service (ReDoS) in moment before 2.29.4'
          }
        ]
      }
    ],
    vulnerabilities: [
      {
        packageName: 'lodash',
        severity: 'high',
        description: 'Prototype Pollution in lodash versions before 4.17.21',
        fixedIn: '4.17.21'
      },
      {
        packageName: 'moment',
        severity: 'critical',
        description: 'Regular Expression Denial of Service (ReDoS) in moment before 2.29.4',
        fixedIn: '2.29.4'
      },
      {
        packageName: 'axios',
        severity: 'moderate',
        description: 'Server-Side Request Forgery (SSRF) vulnerability in redirects',
        fixedIn: null
      }
    ]
  });

  const checkForUpdates = () => {
    // In a real implementation, this would check for package updates
    // For demo purposes, we'll just pretend to check for updates
    
    setDependencies({
      ...dependencies,
      packages: dependencies.packages.map(pkg => ({
        ...pkg,
        // Simulate finding new versions for some packages
        latestVersion: pkg.name === 'tailwindcss' ? '3.3.4' : pkg.latestVersion,
        isOutdated: pkg.name === 'tailwindcss' ? true : pkg.isOutdated
      }))
    });
  };

  return {
    dependencies,
    checkForUpdates
  };
}
