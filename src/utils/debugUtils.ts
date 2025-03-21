
/**
 * Debug utility functions for identifying and resolving common issues
 */

// Check for routing issues by logging key application state information
export const logRoutingState = (routeName: string, params: Record<string, any>) => {
  console.log(`[ROUTE DEBUG] ${routeName}:`, params);
};

// Debug auth state transitions
export const logAuthState = (prevState: any, nextState: any) => {
  console.log(
    `[AUTH DEBUG] State change:`,
    `Previous: ${JSON.stringify(prevState)}`,
    `Current: ${JSON.stringify(nextState)}`
  );
};

// Debug component mounts and renders
export const debugLifecycle = (componentName: string, lifecycle: 'mount' | 'update' | 'unmount', props?: any) => {
  console.log(`[LIFECYCLE] ${componentName} ${lifecycle}`, props ? props : '');
};

// Check if route is valid
export const isValidRoute = (path: string): boolean => {
  // List of known valid routes
  const validRoutes = [
    '/',
    '/login',
    '/dashboard/doctor',
    '/dashboard/patient',
    '/dashboard/receptionist',
    '/opensim',
    '/analytics',
    '/patients',
    '/patient-reports',
    '/anatomy-map',
    '/biomarkers',
    '/health-apps',
    '/analysis',
    '/ai-analysis',
    '/exercises',
    '/reports',
    '/appointments',
    '/settings',
    '/help',
    '/oauth-callback',
  ];

  return validRoutes.includes(path);
};
