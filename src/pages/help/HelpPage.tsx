
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search help topics..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="getting-started" className="w-full">
            <div className="border-b px-4">
              <TabsList className="justify-start">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="support">Contact Support</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-[calc(100vh-280px)] p-6">
              <TabsContent value="getting-started" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <h2 className="text-2xl font-semibold mb-4">Getting Started with OPTM HealPro</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">1. Account Setup</h3>
                    <p className="text-muted-foreground">
                      To get started with OPTM HealPro, you need to create an account. Click on "Sign Up" on the login page and follow the instructions.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">2. Complete Your Profile</h3>
                    <p className="text-muted-foreground">
                      After signing up, complete your profile by adding your personal and medical information. This helps us provide you with personalized care.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">3. Navigate the Dashboard</h3>
                    <p className="text-muted-foreground">
                      Your dashboard provides an overview of your health metrics, appointments, and treatment plans. Use the sidebar to navigate between different sections.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">4. Schedule Appointments</h3>
                    <p className="text-muted-foreground">
                      You can schedule appointments with your healthcare providers through the Appointments section. Select a date, time, and provider to book your visit.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">5. View Health Data</h3>
                    <p className="text-muted-foreground">
                      Access your health data, including biomarkers, exercise plans, and treatment history, through the respective sections in the sidebar.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button>View Video Tutorial</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">How do I reset my password?</h3>
                    <p className="text-muted-foreground">
                      If you've forgotten your password, click on "Forgot Password" on the login page and follow the instructions sent to your email.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Can I connect wearable devices?</h3>
                    <p className="text-muted-foreground">
                      Yes, OPTM HealPro supports integration with various wearable devices and health apps. Navigate to the Settings page to set up your device connections.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">How secure is my health data?</h3>
                    <p className="text-muted-foreground">
                      Your health data is encrypted and stored securely in compliance with healthcare regulations. We prioritize the privacy and security of your information.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">How do I contact my healthcare provider?</h3>
                    <p className="text-muted-foreground">
                      You can message your healthcare provider through the secure messaging feature in the Communications section or schedule a virtual consultation.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">What if I need urgent medical attention?</h3>
                    <p className="text-muted-foreground">
                      OPTM HealPro is not designed for emergency situations. If you require urgent medical attention, please call emergency services immediately.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="support" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
                
                <p className="mb-6">
                  Our support team is available to assist you with any questions or issues you may have with OPTM HealPro.
                </p>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block font-medium">Name</label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-medium">Email</label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block font-medium">Subject</label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block font-medium">Message</label>
                    <textarea
                      id="message"
                      className="w-full min-h-[150px] p-3 border rounded-md border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Describe your issue or question in detail..."
                    ></textarea>
                  </div>
                  
                  <Button className="w-full">Submit Support Request</Button>
                </div>
                
                <div className="mt-8 border-t pt-6 space-y-4">
                  <h3 className="text-xl font-medium">Alternative Contact Methods</h3>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Email Support</p>
                    <p className="text-muted-foreground">support@optmhealpro.com</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Phone Support</p>
                    <p className="text-muted-foreground">+1 (800) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Available Monday-Friday, 9 AM - 5 PM EST</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documentation" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h3 className="text-lg font-medium mb-2">User Guide</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Comprehensive documentation on how to use all features of OPTM HealPro.
                    </p>
                    <p className="text-primary text-sm">View Guide →</p>
                  </Card>
                  
                  <Card className="border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h3 className="text-lg font-medium mb-2">API Documentation</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Details on available APIs for integration with other healthcare systems.
                    </p>
                    <p className="text-primary text-sm">View Docs →</p>
                  </Card>
                  
                  <Card className="border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h3 className="text-lg font-medium mb-2">Release Notes</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Information about recent updates and new features in OPTM HealPro.
                    </p>
                    <p className="text-primary text-sm">View Notes →</p>
                  </Card>
                  
                  <Card className="border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h3 className="text-lg font-medium mb-2">Integration Guide</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Instructions for integrating wearable devices and third-party health apps.
                    </p>
                    <p className="text-primary text-sm">View Guide →</p>
                  </Card>
                  
                  <Card className="border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h3 className="text-lg font-medium mb-2">OpenSim Documentation</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Detailed guidance on using the OpenSim features for biomechanical analysis.
                    </p>
                    <p className="text-primary text-sm">View Docs →</p>
                  </Card>
                  
                  <Card className="border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <h3 className="text-lg font-medium mb-2">Security Whitepaper</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Information about data security, privacy measures, and compliance.
                    </p>
                    <p className="text-primary text-sm">View Whitepaper →</p>
                  </Card>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
