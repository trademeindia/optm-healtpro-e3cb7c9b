
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
  Brain,
  PackageIcon,
  DollarSign,
  ClipboardList
} from 'lucide-react';
import { MenuItem } from './types';
import { UserRole } from '@/contexts/auth/types';

// Common dashboard menu item
export const getDashboardItem = (userRole: UserRole): MenuItem => {
  const path = 
    userRole === 'doctor' ? '/dashboard' : 
    userRole === 'admin' ? '/receptionist-dashboard' : 
    '/patient-dashboard';
    
  return { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path,
    description: 'Overview of patient data and clinical metrics'
  };
};

// Doctor specific menu items
export const getDoctorMenuItems = (): MenuItem[] => [
  getDashboardItem('doctor'),
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
  { 
    icon: Calendar, 
    label: 'Appointments', 
    path: '/appointments',
    description: 'View and manage patient appointments'
  },
];

// Patient specific menu items
export const getPatientMenuItems = (): MenuItem[] => [
  getDashboardItem('patient'),
  { 
    icon: Brain, 
    label: 'AI Report Analysis', 
    path: '/ai-analysis',
    description: 'Get AI-powered analysis of your medical reports'
  },
  { 
    icon: TestTube, 
    label: 'Biomarkers', 
    path: '/biomarkers',
    description: 'View and upload your biomarker data and test results'
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

// Receptionist specific menu items
export const getReceptionistMenuItems = (): MenuItem[] => [
  getDashboardItem('admin'), // Using admin for receptionist temporarily
  { 
    icon: Calendar, 
    label: 'Appointments', 
    path: '/appointments',
    description: 'Manage all clinic appointments'
  },
  { 
    icon: Users, 
    label: 'Patients', 
    path: '/patients',
    description: 'Manage patient profiles and contact information'
  },
  { 
    icon: PackageIcon, 
    label: 'Inventory', 
    path: '/inventory',
    description: 'Manage clinic inventory and supplies'
  },
  { 
    icon: DollarSign, 
    label: 'Billing', 
    path: '/billing',
    description: 'Handle billing and payment processing'
  },
  { 
    icon: ClipboardList, 
    label: 'Forms', 
    path: '/forms',
    description: 'Manage patient intake forms and documents'
  },
];

// Bottom menu items used for all roles
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
