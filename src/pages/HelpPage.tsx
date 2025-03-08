
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, MessageCircle, FileText, Mail, Search, Shield, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import HelpContent from '@/components/help/HelpContent';
import SupportTickets from '@/components/help/SupportTickets';
import Faq from '@/components/help/Faq';
import HelpSettings from '@/components/help/HelpSettings';

const HelpPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Help Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Find support, documentation, and answers to your questions
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search help articles, FAQs, and guides..." 
                className="pl-10 py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
                Search
              </Button>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="getStarted" className="w-full">
              <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger value="getStarted" className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Get Started
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  Support
                </TabsTrigger>
                <TabsTrigger value="documentation" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Documentation
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Help Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="getStarted">
                <HelpContent searchQuery={searchQuery} />
              </TabsContent>
              
              <TabsContent value="faq">
                <Faq searchQuery={searchQuery} />
              </TabsContent>
              
              <TabsContent value="support">
                <SupportTickets />
              </TabsContent>
              
              <TabsContent value="documentation">
                <div className="glass-morphism rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Documentation</h2>
                  <p className="text-muted-foreground mb-4">
                    Find comprehensive guides and documentation to help you get the most out of our platform.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto py-4 px-5">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">User Manual</span>
                        <span className="text-sm text-muted-foreground">Complete platform guide</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-4 px-5">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">API Documentation</span>
                        <span className="text-sm text-muted-foreground">Developer resources</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-4 px-5">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Exercise Guides</span>
                        <span className="text-sm text-muted-foreground">Using exercise features</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-4 px-5">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">Health App Integration</span>
                        <span className="text-sm text-muted-foreground">Connecting health devices</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <HelpSettings />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;
