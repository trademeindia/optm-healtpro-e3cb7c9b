import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface PostureAnalyticsCardProps {
  patientId?: string;
  className?: string;
}

const PostureAnalyticsCard: React.FC<PostureAnalyticsCardProps> = ({ patientId, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [lastSession, setLastSession] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    const fetchPostureData = async () => {
      try {
        setIsLoading(true);
        
        // If we have a specific patient ID, use it
        // Otherwise get the current user
        let userId = patientId;
        
        if (!userId) {
          const { data: sessionData } = await supabase.auth.getSession();
          userId = sessionData?.session?.user?.id;
        }
        
        if (!userId) {
          setIsLoading(false);
          return;
        }
        
        // Query the posture_sessions table for the most recent session
        const { data: sessionData, error: sessionError } = await supabase
          .from('posture_sessions')
          .select('created_at, accuracy')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (sessionError) {
          console.error('Error fetching posture sessions:', sessionError);
          setIsLoading(false);
          return;
        }
        
        if (sessionData && sessionData.length > 0) {
          setHasData(true);
          setLastSession(sessionData[0].created_at);
          setAccuracy(sessionData[0].accuracy);
        }
      } catch (error) {
        console.error('Error in PostureAnalyticsCard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPostureData();
  }, [patientId]);
  
  // Format the last session date
  const formattedLastSession = lastSession 
    ? new Date(lastSession).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    : null;
  
  // Determine accuracy badge color
  const getAccuracyBadge = () => {
    if (accuracy === null) return null;
    
    if (accuracy >= 90) {
      return <Badge className="bg-green-500 hover:bg-green-600">Excellent</Badge>;
    } else if (accuracy >= 75) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Good</Badge>;
    } else if (accuracy >= 60) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Moderate</Badge>;
    } else {
      return <Badge className="bg-red-500 hover:bg-red-600">Needs Work</Badge>;
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Posture Analytics</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" align="end" className="max-w-sm">
                <p className="text-sm">
                  Posture analytics uses motion tracking to provide feedback on your exercise form and body position.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        ) : !hasData ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">No posture analysis data available yet.</p>
            <p className="text-xs text-muted-foreground">
              Complete a posture tracking session to see your analytics.
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last session</span>
              <span className="text-sm font-medium">{formattedLastSession}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Form accuracy</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{accuracy}%</span>
                {getAccuracyBadge()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-1">
        <Button variant="ghost" className="w-full justify-between" size="sm">
          <span>View detailed posture analytics</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostureAnalyticsCard;
