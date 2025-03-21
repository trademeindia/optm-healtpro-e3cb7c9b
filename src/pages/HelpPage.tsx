
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, MessageCircle, FileText, Mail, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const HelpPage: React.FC = () => {
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
                  <HelpCircle className="h-4 w-4" />
                  Get Started
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="documentation" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Documentation
                </TabsTrigger>
                <TabsTrigger value="support" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Contact Support
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="getStarted">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dashboard Overview</CardTitle>
                      <CardDescription>Learn how to navigate your health dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Our dashboard provides a comprehensive view of your health metrics, appointments, and treatment plans.
                      </p>
                      <Button variant="outline" className="w-full">View Guide</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Connecting Health Apps</CardTitle>
                      <CardDescription>Integrate with your favorite fitness trackers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sync data from Google Fit, Apple Health, and other fitness apps to get the most out of your health dashboard.
                      </p>
                      <Button variant="outline" className="w-full">View Guide</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Quick answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-b pb-3">
                      <h3 className="font-medium mb-1">How do I reset my password?</h3>
                      <p className="text-sm text-muted-foreground">
                        You can reset your password by clicking "Forgot Password" on the login screen.
                      </p>
                    </div>
                    <div className="border-b pb-3">
                      <h3 className="font-medium mb-1">How do I connect my fitness tracker?</h3>
                      <p className="text-sm text-muted-foreground">
                        Go to the Health Apps section and follow the instructions to connect your device.
                      </p>
                    </div>
                    <div className="border-b pb-3">
                      <h3 className="font-medium mb-1">Can I export my health data?</h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, you can export your data in the Settings > Privacy section.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documentation">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>Comprehensive guides and resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start h-auto py-4 px-5">
                        <div className="flex flex-col items-start text-left">
                          <span className="font-semibold">User Guide</span>
                          <span className="text-sm text-muted-foreground">Complete platform guide</span>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start h-auto py-4 px-5">
                        <div className="flex flex-col items-start text-left">
                          <span className="font-semibold">API Documentation</span>
                          <span className="text-sm text-muted-foreground">For developers</span>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start h-auto py-4 px-5">
                        <div className="flex flex-col items-start text-left">
                          <span className="font-semibold">Health Integration Guide</span>
                          <span className="text-sm text-muted-foreground">Connect fitness apps</span>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start h-auto py-4 px-5">
                        <div className="flex flex-col items-start text-left">
                          <span className="font-semibold">Exercise Guides</span>
                          <span className="text-sm text-muted-foreground">Video tutorials</span>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="support">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>Get help from our support team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input placeholder="Your name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input placeholder="Your email" type="email" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <Input placeholder="Subject of your inquiry" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <Textarea 
                          className="min-h-[120px]"
                          placeholder="Describe your issue or question"
                        />
                      </div>
                      <Button className="w-full">Submit Support Request</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;
