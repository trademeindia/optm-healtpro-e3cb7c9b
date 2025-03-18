
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleFitInfo from './GoogleFitInfo';
import { Heart, Activity, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FitnessData, HealthMetric, useFitnessIntegration } from '@/hooks/fitness';
import GoogleFitSyncPanel from '@/components/integrations/GoogleFitSyncPanel';

interface GoogleFitTabProps {
  onHealthDataSync: (data: any) => void;
}

const GoogleFitTab: React.FC<GoogleFitTabProps> = ({ onHealthDataSync }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <GoogleFitSyncPanel onHealthDataSync={onHealthDataSync} />
      </div>
      
      <div className="lg:col-span-4">
        <GoogleFitInfo />
      </div>
    </div>
  );
};

export default GoogleFitTab;
