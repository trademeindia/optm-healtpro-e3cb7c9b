
import React from 'react';
import { Bell, Search, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full h-16 flex items-center justify-between px-4 md:px-6 glass-morphism border-b sticky top-0 z-10", className)}>
      <div className="flex items-center">
        <h1 className="text-lg md:text-2xl font-bold text-gradient mr-2 md:mr-4">OPTM HealPro</h1>
        <div className="hidden md:flex items-center bg-white/50 dark:bg-black/20 rounded-lg px-3 py-1.5 ml-8">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input
            type="text"
            placeholder="Search patients, treatments, etc."
            className="bg-transparent border-none outline-none text-sm w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors">
          <Search className="w-4 h-4 md:hidden text-foreground" />
          <Bell className="w-4 h-4 md:w-5 md:h-5 hidden md:block text-foreground" />
        </button>
        <button className="w-8 h-8 md:w-9 md:h-9 hidden md:flex items-center justify-center rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors">
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs md:text-sm font-medium text-primary">DR</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
