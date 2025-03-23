
// System status types
export type StatusType = 'success' | 'warning' | 'error' | 'loading';

export interface SystemStatusItem {
  status: StatusType;
  message: string;
  details: string[];
}

export interface SystemStatus {
  [key: string]: SystemStatusItem;
}

// Project info types
export interface TechStackItem {
  name: string;
  version: string;
  icon?: string;
  description: string;
}

export interface Script {
  name: string;
  command: string;
  description: string;
}

export interface EnvVar {
  name: string;
  value: string;
  description: string;
  isSecret: boolean;
}

export interface FileStructureItem {
  name: string;
  type: 'file' | 'directory';
  isImportant?: boolean;
  children?: FileStructureItem[];
}

export interface ProjectInfo {
  name: string;
  version: string;
  lastUpdated: string;
  description?: string;
  techStack: TechStackItem[];
  scripts: Script[];
  environmentVariables: EnvVar[];
  missingEnvVars: string[];
  fileStructure: FileStructureItem[];
}

// Dependencies types
export interface DependencyVulnerability {
  severity: 'critical' | 'high' | 'moderate' | 'low';
  description: string;
  fixedIn?: string | null;
}

export interface DependencyPackage {
  name: string;
  currentVersion: string;
  latestVersion: string;
  isDev: boolean;
  isOutdated: boolean;
  vulnerabilities: {
    severity: 'critical' | 'high' | 'moderate' | 'low';
    description: string;
  }[];
}

export interface Vulnerability {
  packageName: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  description: string;
  fixedIn: string | null;
}

export interface Dependencies {
  packages: DependencyPackage[];
  vulnerabilities: Vulnerability[];
}

// Performance metrics types
export interface BuildTime {
  timestamp: string;
  duration: number;
}

export interface BundleSize {
  name: string;
  js: number;
  css: number;
  assets: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  disk: number;
  cpuHistory: TimeSeriesDataPoint[];
  memoryHistory: TimeSeriesDataPoint[];
  diskHistory: TimeSeriesDataPoint[];
}

export interface PerformanceMetrics {
  latestBuildTime: number;
  totalBundleSize: number;
  buildTimeChange: number;
  bundleSizeChange: number;
  performanceScore: number;
  performanceScoreChange: number;
  buildTimeHistory: BuildTime[];
  bundleSizeHistory: BundleSize[];
  resourceUsage: ResourceUsage;
}

// Dashboard settings types
export interface NotificationSettings {
  buildNotifications: boolean;
  dependencyUpdates: boolean;
  securityAlerts: boolean;
  performanceAlerts: boolean;
}

export interface DisplaySettings {
  showSystemCheck: boolean;
  showPerformance: boolean;
  showDependencies: boolean;
  defaultTab: string;
}

export interface DashboardSettings {
  autoRefresh: boolean;
  showVerboseLogs: boolean;
  showHiddenFiles: boolean;
  enableTips: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  display: DisplaySettings;
}
