
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart2, 
  Settings, 
  HelpCircle,
  TestTube,
  Smartphone,
  Dumbbell,
  Calendar,
  Brain
} from 'lucide-react';
import { MenuItem } from './types';

// Common dashboard menu item
export const getDashboardItem = (isDoctor: boolean): MenuItem => ({ 
  icon: LayoutDashboard, 
  label: 'Dashboard', 
  path: isDoctor ? '/dashboard' : '/patient-dashboard',
  description: 'Overview of patient data and clinical metrics'
});

// Doctor specific menu items
export const getDoctorMenuItems = (): MenuItem[] => [
  getDashboardItem(true),
  { 
    icon: Users, 
    label: 'Patients', 
    path: '/patients',
    description: 'Manage patient records and information'
  },
  { 
    icon: FileText, 
    label: 'Reports', 
    path: '/reports',
    description: 'Access and create clinical reports and documentation'
  },
  { 
    icon: BarChart2, 
    label: 'Analytics', 
    path: '/analytics',
    description: 'Visualize clinical data and treatment outcomes'
  },
];

// Patient specific menu items
export const getPatientMenuItems = (): MenuItem[] => [
  getDashboardItem(false),
  { 
    icon: TestTube, 
    label: 'Biomarkers', 
    path: '/biomarkers',
    description: 'View and upload your biomarker data and test results'
  },
  { 
    icon: Brain, 
    label: 'AI Report Analysis', 
    path: '/ai-analysis',
    description: 'Get AI-powered analysis of your medical reports'
  },
  { 
    icon: FileText, 
    label: 'My Reports', 
    path: '/patient-reports',
    description: 'View your medical reports and documents'
  },
  { 
    icon: Calendar, 
    label: 'Appointments', 
    path: '/appointments',
    description: 'View and manage your appointments'
  },
  { 
    icon: Smartphone, 
    label: 'Health Apps', 
    path: '/health-apps',
    description: 'Connect and manage your health and fitness applications'
  },
  { 
    icon: Dumbbell, 
    label: 'Exercises', 
    path: '/exercises',
    description: 'View and perform recommended exercises with AI guidance'
  },
];

// Bottom menu items used for both doctor and patient
export const getBottomMenuItems = (): MenuItem[] => [
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/settings',
    description: 'Configure application preferences'
  },
  { 
    icon: HelpCircle, 
    label: 'Help', 
    path: '/help',
    description: 'Get assistance and support'
  },
];
