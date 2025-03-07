
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  description: string;
}

export interface SidebarProps {
  className?: string;
}
