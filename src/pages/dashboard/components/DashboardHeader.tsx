
import React from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  doctorName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ doctorName }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hi, Dr. {doctorName}. Welcome back to your clinic dashboard!
        </p>
      </div>
      
      <div className="flex items-center mt-2 md:mt-0 gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search patients, records..." 
            className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          <Button variant="outline" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              4
            </span>
          </Button>
          
          <Button variant="outline" size="icon" className="relative h-9 w-9">
            <MessageSquare className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="User" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
