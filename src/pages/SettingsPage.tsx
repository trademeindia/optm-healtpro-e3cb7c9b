
import React from 'react';
import { useAuth } from '@/contexts/auth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, Smartphone, Palette } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Customize your experience, {user?.user_metadata?.name || 'User'}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6 grid grid-cols-5 lg:w-auto">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="p-4 border rounded-lg">
                <h2 className="text-lg font-medium mb-4">Profile Settings</h2>
                <p className="text-muted-foreground">
                  Manage your personal information and account preferences
                </p>
              </TabsContent>
              
              <TabsContent value="notifications" className="p-4 border rounded-lg">
                <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
                <p className="text-muted-foreground">
                  Configure how you want to receive alerts and reminders
                </p>
              </TabsContent>
              
              <TabsContent value="privacy" className="p-4 border rounded-lg">
                <h2 className="text-lg font-medium mb-4">Privacy & Security</h2>
                <p className="text-muted-foreground">
                  Manage your security settings and control your data
                </p>
              </TabsContent>
              
              <TabsContent value="integrations" className="p-4 border rounded-lg">
                <h2 className="text-lg font-medium mb-4">Connected Apps</h2>
                <p className="text-muted-foreground">
                  Manage integrations with fitness trackers and health apps
                </p>
              </TabsContent>
              
              <TabsContent value="appearance" className="p-4 border rounded-lg">
                <h2 className="text-lg font-medium mb-4">Appearance</h2>
                <p className="text-muted-foreground">
                  Customize the look and feel of your dashboard
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
