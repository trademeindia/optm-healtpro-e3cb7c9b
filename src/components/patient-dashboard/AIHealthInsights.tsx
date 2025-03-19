
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Activity, Bed, Dumbbell, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthInsightCategory from './health-insights/HealthInsightCategory';
import useHealthInsights from '@/hooks/dashboard/useHealthInsights';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { FitnessData } from '@/hooks/useFitnessIntegration';

interface AIHealthInsightsProps {
  fitnessData: FitnessData;
}

const AIHealthInsights: React.FC<AIHealthInsightsProps> = ({ fitnessData }) => {
  const { 
    insights, 
    generateInsights, 
    isGenerating,
    lastGenerated 
  } = useHealthInsights(fitnessData);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex items-center justify-between flex-row">
        <div>
          <CardTitle className="text-lg">AI Health Insights</CardTitle>
          <div className="text-sm text-muted-foreground mt-0.5">
            {lastGenerated ? (
              <>Last updated: {new Date(lastGenerated).toLocaleTimeString()}</>
            ) : (
              <>Real-time health interpretations</>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateInsights} 
          disabled={isGenerating}
        >
          {isGenerating ? 'Analyzing...' : 'Refresh Insights'}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cardiovascular">
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="cardiovascular" className="flex gap-1 items-center">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Heart</span>
            </TabsTrigger>
            <TabsTrigger value="muscular" className="flex gap-1 items-center">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Muscles</span>
            </TabsTrigger>
            <TabsTrigger value="nervous" className="flex gap-1 items-center">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Nerves</span>
            </TabsTrigger>
            <TabsTrigger value="mobility" className="flex gap-1 items-center">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Mobility</span>
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex gap-1 items-center">
              <Bed className="h-4 w-4" />
              <span className="hidden sm:inline">Sleep</span>
            </TabsTrigger>
            <TabsTrigger value="overall" className="flex gap-1 items-center">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Overall</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cardiovascular">
            <HealthInsightCategory 
              title="Cardiovascular Health" 
              icon={<Heart className="h-5 w-5 text-rose-500" />}
              insight={insights.cardiovascular.insight}
              recommendation={insights.cardiovascular.recommendation}
              trendData={fitnessData.heartRate.data.map(item => ({
                time: new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                value: item.value
              }))}
              trendLabel="Heart Rate"
              trendUnit="bpm"
              trendColor="#ef4444"
              score={insights.cardiovascular.score}
            />
          </TabsContent>
          
          <TabsContent value="muscular">
            <HealthInsightCategory 
              title="Muscle & Tissue Recovery" 
              icon={<Dumbbell className="h-5 w-5 text-emerald-500" />}
              insight={insights.muscular.insight}
              recommendation={insights.muscular.recommendation}
              trendData={[
                { day: 'Mon', value: 65 },
                { day: 'Tue', value: 68 },
                { day: 'Wed', value: 72 },
                { day: 'Thu', value: 75 },
                { day: 'Fri', value: 80 },
                { day: 'Sat', value: 85 },
                { day: 'Sun', value: 88 },
              ]}
              trendLabel="Recovery Rate"
              trendUnit="%"
              trendColor="#10b981"
              score={insights.muscular.score}
            />
          </TabsContent>
          
          <TabsContent value="nervous">
            <HealthInsightCategory 
              title="Nerve Health & Pain Sensitivity" 
              icon={<Zap className="h-5 w-5 text-amber-500" />}
              insight={insights.nervous.insight}
              recommendation={insights.nervous.recommendation}
              trendData={[
                { day: 'Mon', value: 7 },
                { day: 'Tue', value: 6 },
                { day: 'Wed', value: 5 },
                { day: 'Thu', value: 4 },
                { day: 'Fri', value: 3 },
                { day: 'Sat', value: 3 },
                { day: 'Sun', value: 2 },
              ]}
              trendLabel="Pain Level"
              trendUnit="/10"
              trendColor="#f59e0b"
              invertTrend={true}
              score={insights.nervous.score}
            />
          </TabsContent>
          
          <TabsContent value="mobility">
            <HealthInsightCategory 
              title="Joint & Mobility Improvement" 
              icon={<Activity className="h-5 w-5 text-blue-500" />}
              insight={insights.mobility.insight}
              recommendation={insights.mobility.recommendation}
              trendData={fitnessData.steps.data.map(item => ({
                day: new Date(item.timestamp).toLocaleDateString([], {weekday: 'short'}),
                value: item.value / 100 // Convert steps to a mobility score
              }))}
              trendLabel="Mobility Score"
              trendUnit="/100"
              trendColor="#3b82f6"
              score={insights.mobility.score}
            />
          </TabsContent>
          
          <TabsContent value="sleep">
            <HealthInsightCategory 
              title="Sleep & Recovery Insights" 
              icon={<Bed className="h-5 w-5 text-indigo-500" />}
              insight={insights.sleep.insight}
              recommendation={insights.sleep.recommendation}
              trendData={[
                { day: 'Mon', value: 6.5 },
                { day: 'Tue', value: 7.2 },
                { day: 'Wed', value: 8.0 },
                { day: 'Thu', value: 7.5 },
                { day: 'Fri', value: 6.8 },
                { day: 'Sat', value: 8.5 },
                { day: 'Sun', value: 7.8 },
              ]}
              trendLabel="Sleep Hours"
              trendUnit="hrs"
              trendColor="#6366f1"
              score={insights.sleep.score}
            />
          </TabsContent>
          
          <TabsContent value="overall">
            <HealthInsightCategory 
              title="Overall Health Analysis" 
              icon={<Brain className="h-5 w-5 text-purple-500" />}
              insight={insights.overall.insight}
              recommendation={insights.overall.recommendation}
              trendData={[
                { day: 'Mon', value: 75 },
                { day: 'Tue', value: 77 },
                { day: 'Wed', value: 80 },
                { day: 'Thu', value: 82 },
                { day: 'Fri', value: 85 },
                { day: 'Sat', value: 87 },
                { day: 'Sun', value: 90 },
              ]}
              trendLabel="Health Score"
              trendUnit="/100"
              trendColor="#8b5cf6"
              score={insights.overall.score}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIHealthInsights;
