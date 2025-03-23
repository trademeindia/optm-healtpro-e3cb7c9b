
import { useState, useEffect } from 'react';
import { ProjectInfo } from '../types';

export function useProjectInfo() {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'health-dashboard',
    version: '1.0.0',
    lastUpdated: '2023-07-15',
    description: 'A comprehensive healthcare dashboard for monitoring patient data',
    techStack: [
      {
        name: 'React',
        version: '18.3.1',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>',
        description: 'A JavaScript library for building user interfaces'
      },
      {
        name: 'TypeScript',
        version: '4.9.5',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="text-blue-700"><path d="M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M9,11.5H12V9H9V11.5M13,11.5H16V9H13V11.5M13,14H16V16H13V14M9,14H12V16H9V14Z"/></svg>',
        description: 'A typed superset of JavaScript'
      },
      {
        name: 'TailwindCSS',
        version: '3.3.2',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="text-sky-500"><path d="M12 6C9.33 6 7.33 7.33 6 10C7.33 12.67 9.33 14 12 14C14.67 14 16.67 12.67 18 10C16.67 7.33 14.67 6 12 6M6 18C7.33 15.33 9.33 14 12 14C14.67 14 16.67 15.33 18 18C16.67 20.67 14.67 22 12 22C9.33 22 7.33 20.67 6 18M12 2C14.67 2 16.67 3.33 18 6C16.67 8.67 14.67 10 12 10C9.33 10 7.33 8.67 6 6C7.33 3.33 9.33 2 12 2Z"/></svg>',
        description: 'A utility-first CSS framework'
      },
      {
        name: 'Next.js',
        version: '13.4.7',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.2 5.4V17.7L6.3 12.9L8.7 12.9L8.7 5.4H11.2ZM12.8 5.4H15.3V12.9H17.7L12.8 17.7V5.4Z"/></svg>',
        description: 'The React Framework for Production'
      },
      {
        name: 'Framer Motion',
        version: '10.16.4',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="text-purple-600"><path d="M4 4h16v16h-16z"/></svg>',
        description: 'A production-ready motion library for React'
      },
      {
        name: 'Recharts',
        version: '2.5.0',
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="9" x2="9" y2="21"></line><line x1="15" y1="9" x2="15" y2="21"></line></svg>',
        description: 'A charting library built with React and D3'
      }
    ],
    scripts: [
      {
        name: 'Start Dev Server',
        command: 'npm run dev',
        description: 'Start the development server with hot-reloading'
      },
      {
        name: 'Build',
        command: 'npm run build',
        description: 'Build the production-ready application'
      },
      {
        name: 'Test',
        command: 'npm run test',
        description: 'Run the test suite with Jest'
      },
      {
        name: 'Lint',
        command: 'npm run lint',
        description: 'Run ESLint to check for code quality issues'
      }
    ],
    environmentVariables: [
      {
        name: 'NEXT_PUBLIC_API_URL',
        value: 'https://api.example.com',
        description: 'The base URL for API requests',
        isSecret: false
      },
      {
        name: 'NEXT_PUBLIC_GA_ID',
        value: 'G-12345ABCDE',
        description: 'Google Analytics tracking ID',
        isSecret: false
      },
      {
        name: 'DATABASE_URL',
        value: 'postgresql://username:password@localhost:5432/mydb',
        description: 'Connection string for the database',
        isSecret: true
      },
      {
        name: 'JWT_SECRET',
        value: 'a1b2c3d4e5f6g7h8i9j0',
        description: 'Secret key for JWT token generation',
        isSecret: true
      }
    ],
    missingEnvVars: [
      'STRIPE_SECRET_KEY',
      'MAILCHIMP_API_KEY'
    ],
    fileStructure: [
      {
        name: 'src',
        type: 'directory',
        isImportant: true,
        children: [
          {
            name: 'components',
            type: 'directory',
            children: [
              { name: 'ui', type: 'directory', children: [] },
              { name: 'layout', type: 'directory', children: [] },
              { name: 'dashboard', type: 'directory', children: [] }
            ]
          },
          {
            name: 'pages',
            type: 'directory',
            isImportant: true,
            children: [
              { name: 'index.tsx', type: 'file' },
              { name: 'dashboard.tsx', type: 'file', isImportant: true },
              { name: 'patients', type: 'directory', children: [] }
            ]
          },
          {
            name: 'utils',
            type: 'directory',
            children: [
              { name: 'api.ts', type: 'file' },
              { name: 'formatting.ts', type: 'file' }
            ]
          },
          {
            name: 'hooks',
            type: 'directory',
            children: [
              { name: 'useAuth.ts', type: 'file' },
              { name: 'usePatients.ts', type: 'file' }
            ]
          },
          {
            name: 'types',
            type: 'directory',
            children: [
              { name: 'patient.ts', type: 'file' },
              { name: 'appointment.ts', type: 'file' }
            ]
          }
        ]
      },
      {
        name: 'public',
        type: 'directory',
        children: [
          { name: 'images', type: 'directory', children: [] },
          { name: 'favicon.ico', type: 'file' }
        ]
      },
      { name: 'package.json', type: 'file', isImportant: true },
      { name: 'tsconfig.json', type: 'file', isImportant: true },
      { name: '.env.local', type: 'file', isImportant: true },
      { name: 'README.md', type: 'file' }
    ]
  });

  const refreshProjectInfo = () => {
    // In a real implementation, this would fetch actual project information
    // For demo purposes, we'll just pretend to refresh the data
    
    setProjectInfo({
      ...projectInfo,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  return {
    projectInfo,
    refreshProjectInfo
  };
}
