import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chart, ChartData, ChartOptions } from 'chart.js/auto';
import { Line, Bar } from 'react-chartjs-2';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionData {
  date: string;
  accuracy: number;
  reps: number;
  duration: number;
}

interface PatientAnalyticsPageProps {
  patientId?: string;
}

const PatientAnalyticsPage: React.FC<PatientAnalyticsPageProps> = ({ patientId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    const fetchSessionData = async () => {
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
        
        // Fetch the session data from the database
        const { data, error } = await supabase
          .from('posture_sessions')
          .select('created_at, accuracy, total_reps, duration_sec')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30); // Last 30 sessions
          
        if (error) {
          console.error('Error fetching session data:', error);
          setIsLoading(false);
          return;
        }
        
        // Format the data for the charts
        const formattedData = data?.map(session => ({
          date: new Date(session.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
          }),
          accuracy: session.accuracy,
          reps: session.total_reps,
          duration: Math.round(session.duration_sec / 60) // Convert to minutes
        })) || [];
        
        // Sort chronologically for the charts
        formattedData.reverse();
        
        setSessions(formattedData);
      } catch (error) {
        console.error('Error in PatientAnalyticsPage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
  }, [patientId]);
  
  // Create chart configurations
  const accuracyData: ChartData = {
    labels: sessions.map(s => s.date),
    datasets: [
      {
        label: 'Form Accuracy (%)',
        data: sessions.map(s => s.accuracy),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        tension: 0.4,
      },
    ],
  };
  
  const repsData: ChartData = {
    labels: sessions.map(s => s.date),
    datasets: [
      {
        label: 'Repetitions',
        data: sessions.map(s => s.reps),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const durationData: ChartData = {
    labels: sessions.map(s => s.date),
    datasets: [
      {
        label: 'Session Duration (minutes)',
        data: sessions.map(s => s.duration),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Motion Tracking Analytics</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Track your progress and form accuracy over time
        </p>
        
        <div className="flex items-center space-x-2">
          <button 
            className={`px-3 py-1 rounded text-sm ${chartType === 'line' ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground'}`}
            onClick={() => setChartType('line')}
          >
            Line
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${chartType === 'bar' ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground'}`}
            onClick={() => setChartType('bar')}
          >
            Bar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Form Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : sessions.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No data available</p>
              </div>
            ) : (
              <div className="h-[200px]">
                {chartType === 'line' ? (
                  <Line data={accuracyData} options={chartOptions} />
                ) : (
                  <Bar data={accuracyData} options={chartOptions} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Repetitions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : sessions.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No data available</p>
              </div>
            ) : (
              <div className="h-[200px]">
                {chartType === 'line' ? (
                  <Line data={repsData} options={chartOptions} />
                ) : (
                  <Bar data={repsData} options={chartOptions} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : sessions.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No data available</p>
              </div>
            ) : (
              <div className="h-[200px]">
                {chartType === 'line' ? (
                  <Line data={durationData} options={chartOptions} />
                ) : (
                  <Bar data={durationData} options={chartOptions} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="accuracy" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="accuracy">Accuracy Analysis</TabsTrigger>
          <TabsTrigger value="progression">Progression</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accuracy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Accuracy Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-muted-foreground">No accuracy data available yet. Complete motion tracking sessions to see analysis.</p>
              ) : (
                <div className="space-y-4">
                  <p>Your average form accuracy across all sessions is <strong>{Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)}%</strong>.</p>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Form Tips:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Maintain proper alignment during movements</li>
                      <li>Focus on slow, controlled repetitions</li>
                      <li>Keep your core engaged throughout exercises</li>
                      <li>Use the real-time feedback to adjust your form</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progression" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progression Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-muted-foreground">No progression data available yet. Complete more motion tracking sessions to see your improvement.</p>
              ) : (
                <div className="space-y-4">
                  <p>You've completed <strong>{sessions.length}</strong> sessions with a total of <strong>{sessions.reduce((sum, s) => sum + s.reps, 0)}</strong> repetitions.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Average Accuracy</p>
                      <p className="text-2xl font-bold">{Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)}%</p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Average Reps/Session</p>
                      <p className="text-2xl font-bold">{Math.round(sessions.reduce((sum, s) => sum + s.reps, 0) / sessions.length)}</p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Average Duration</p>
                      <p className="text-2xl font-bold">{Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length)} min</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">Keep up the good work! Consistent practice will lead to improved form and better results.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-muted-foreground">Complete more motion tracking sessions to receive personalized recommendations.</p>
              ) : (
                <div className="space-y-4">
                  <p>Based on your tracking data, here are some personalized recommendations:</p>
                  
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium">Session Frequency</h4>
                      <p className="text-sm text-muted-foreground mt-1">Aim for 3-4 tracking sessions per week for optimal improvement.</p>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium">Form Improvement</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {sessions[sessions.length - 1].accuracy < 70 
                          ? "Focus on quality over quantity. Slow down your movements and follow the form guides carefully."
                          : "Your form is looking good! Consider increasing repetitions while maintaining good technique."}
                      </p>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium">Next Steps</h4>
                      <p className="text-sm text-muted-foreground mt-1">Schedule a follow-up with your physical therapist to review your progress and adjust your program as needed.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientAnalyticsPage;
