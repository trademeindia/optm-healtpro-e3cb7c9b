
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Activity, BarChart4, Calendar } from 'lucide-react';
import { MuscleGroup, ProgressData } from '@/types/exercise.types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import ExerciseMetricsChart from '@/components/exercises/ExerciseMetricsChart';

interface ProgressTrackingProps {
  muscleGroups: MuscleGroup[];
  progressData: ProgressData[];
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({ muscleGroups, progressData }) => {
  const muscleGroupsChartData = muscleGroups.map(group => ({
    name: group.name,
    value: group.progress,
    fill: `hsl(${120 + (group.progress * 1.2)}, 70%, 45%)`
  }));
  
  return (
    <Tabs defaultValue="progress">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Progress</h3>
        <TabsList>
          <TabsTrigger value="progress" className="text-xs">
            <Activity className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="muscle-groups" className="text-xs">
            <BarChart4 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="progress" className="space-y-4 mt-0">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="strength" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="flexibility" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="endurance" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="flex items-center justify-center space-x-4 mt-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#f43f5e] mr-1"></div>
                <span className="text-xs">Strength</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#06b6d4] mr-1"></div>
                <span className="text-xs">Flexibility</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#eab308] mr-1"></div>
                <span className="text-xs">Endurance</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Deep Squat Sequence</span>
                  <Badge variant="outline" className="text-xs">Today</Badge>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">12 reps completed</span>
                  <span className="text-xs font-medium text-green-500">92% accuracy</span>
                </div>
              </div>
              
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Kettlebell Lunges</span>
                  <Badge variant="outline" className="text-xs">Yesterday</Badge>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">8 reps completed</span>
                  <span className="text-xs font-medium text-amber-500">78% accuracy</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Shoulder Press</span>
                  <Badge variant="outline" className="text-xs">3 days ago</Badge>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">15 reps completed</span>
                  <span className="text-xs font-medium text-green-500">95% accuracy</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="muscle-groups" className="space-y-4 mt-0">
        <ExerciseMetricsChart 
          data={muscleGroupsChartData}
          title="Muscle Group Progress"
        />
      </TabsContent>
      
      <TabsContent value="history" className="mt-0">
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Exercise History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.map((entry, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{entry.date}</span>
                    <Badge variant="secondary" className="text-xs">
                      {entry.endurance > 70 ? 'Excellent' : entry.endurance > 50 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Strength</p>
                      <p className="text-sm font-medium">{entry.strength}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Flexibility</p>
                      <p className="text-sm font-medium">{entry.flexibility}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Endurance</p>
                      <p className="text-sm font-medium">{entry.endurance}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProgressTracking;
