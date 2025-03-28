import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface AnalyticsData {
  totalSessions: number;
  avgPostureScore: number;
  postureTrend: 'improving' | 'declining' | 'stable';
  latestScore: number | null;
}

interface PostureAnalyticsCardProps {
  patientId?: string;
}

const PostureAnalyticsCard: React.FC<PostureAnalyticsCardProps> = ({ patientId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData>({
    totalSessions: 0,
    avgPostureScore: 0,
    postureTrend: 'stable',
    latestScore: null
  });
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        
        // Get current user if patientId not provided
        const userId = patientId || user?.id;
        
        if (!userId) {
          console.error('No user ID available for posture analytics');
          setIsLoading(false);
          return;
        }
        
        // Fetch posture data from the database
        const { data: postureData, error } = await supabase
          .from('body_analysis')
          .select('*')
          .eq('patient_id', userId)
          .order('timestamp', { ascending: false })
          .limit(30); // Last 30 records
        
        if (error) {
          console.error('Error fetching posture data:', error);
          setIsLoading(false);
          return;
        }
        
        // Process the data
        if (postureData && postureData.length > 0) {
          // Calculate average posture score
          const totalScore = postureData.reduce((sum, record) => sum + (record.posture_score || 0), 0);
          const avgScore = totalScore / postureData.length;
          
          // Determine trend by comparing first half and second half
          const midpoint = Math.floor(postureData.length / 2);
          const recentRecords = postureData.slice(0, midpoint);
          const olderRecords = postureData.slice(midpoint);
          
          const recentAvg = recentRecords.length 
            ? recentRecords.reduce((sum, r) => sum + (r.posture_score || 0), 0) / recentRecords.length 
            : 0;
            
          const olderAvg = olderRecords.length 
            ? olderRecords.reduce((sum, r) => sum + (r.posture_score || 0), 0) / olderRecords.length 
            : 0;
          
          let trend: 'improving' | 'declining' | 'stable' = 'stable';
          
          if (recentAvg > olderAvg + 5) {
            trend = 'improving';
          } else if (recentAvg < olderAvg - 5) {
            trend = 'declining';
          }
          
          // Set the analytics data
          setData({
            totalSessions: postureData.length,
            avgPostureScore: Math.round(avgScore),
            postureTrend: trend,
            latestScore: postureData[0]?.posture_score || null
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error analyzing posture data:', err);
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [patientId, user]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posture Analytics</CardTitle>
          <CardDescription>Loading posture data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4 mt-2" />
        </CardContent>
      </Card>
    );
  }
  
  const getTrendIndicator = () => {
    if (data.postureTrend === 'improving') {
      return '↑ Improving';
    } else if (data.postureTrend === 'declining') {
      return '↓ Declining';
    } else {
      return '→ Stable';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Posture Analytics</CardTitle>
        <CardDescription>Recent posture analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-lg font-semibold">{data.avgPostureScore}%</div>
          <div className="text-sm text-muted-foreground">
            Average Posture Score ({data.totalSessions} sessions)
          </div>
          <Progress value={data.avgPostureScore} />
        </div>
        
        <div className="space-y-1">
          <div className="text-sm font-medium">Trend: {getTrendIndicator()}</div>
          {data.latestScore !== null ? (
            <div className="text-sm text-muted-foreground">
              Latest Score: {data.latestScore}%
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No recent scores available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostureAnalyticsCard;
