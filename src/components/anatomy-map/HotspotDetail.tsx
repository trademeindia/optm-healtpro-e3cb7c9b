
import React from 'react';
import { HotSpot } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';

interface HotspotDetailProps {
  hotspot: HotSpot;
}

const HotspotDetail: React.FC<HotspotDetailProps> = ({ hotspot }) => {
  return (
    <Card className="absolute right-4 top-4 z-50 w-72 shadow-lg bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{hotspot.label}</CardTitle>
          <Badge 
            variant="outline" 
            className={
              hotspot.metadata.severity.toLowerCase() === 'high'
              ? 'bg-red-500/10 text-red-500 border-red-500/20'
              : hotspot.metadata.severity.toLowerCase() === 'medium'
              ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            }
          >
            {hotspot.metadata.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {hotspot.description}
        </p>
        
        <div className="space-y-2 text-xs">
          {hotspot.metadata.regionId && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              <span>Region: {hotspot.metadata.regionId}</span>
            </div>
          )}
          
          {hotspot.metadata.createdAt && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
              <span>Added: {new Date(hotspot.metadata.createdAt).toLocaleDateString()}</span>
            </div>
          )}
          
          {Array.isArray(hotspot.metadata.symptoms) && hotspot.metadata.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hotspot.metadata.symptoms.map((symptom, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {symptom}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotspotDetail;
