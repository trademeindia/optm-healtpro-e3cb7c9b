
import React from 'react';
import { Check, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GoogleFitInfo: React.FC = () => {
  return (
    <>
      <div className="glass-morphism rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Google Fit Integration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Connect your Google Fit account to track and monitor your health metrics in real-time.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs">
              <span className="font-medium">Real-time syncing</span> - Get your latest fitness data instantly
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs">
              <span className="font-medium">Comprehensive metrics</span> - Track steps, heart rate, sleep and more
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs">
              <span className="font-medium">Historical data</span> - View your progress over time with detailed charts
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs">
              <span className="font-medium">Secure connection</span> - Your data is transferred securely using OAuth 2.0
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Supported Devices</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">Android Phones</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">Google Pixel</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">Wear OS watches</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs">Fitbit devices</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-morphism rounded-2xl p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you're having trouble connecting to Google Fit or syncing your data, here are some resources to help you.
        </p>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            Troubleshooting Guide
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            Contact Support
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            FAQ
          </Button>
        </div>
      </div>
    </>
  );
};

export default GoogleFitInfo;
