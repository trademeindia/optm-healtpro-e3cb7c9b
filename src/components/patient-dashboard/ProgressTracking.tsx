
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { MuscleGroup, ProgressData } from '@/types/exercise.types';
import { Activity, Dumbbell, TrendingUp, Calendar } from 'lucide-react';
import DoctorRecommendations from '@/pages/exercises/components/DoctorRecommendations';

interface ProgressTrackingProps {
  muscleGroups: MuscleGroup[];
  progressData: ProgressData[];
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  muscleGroups,
  progressData
}) => {
  // Sample exercise data
  const exerciseData = [
    { name: 'Week 1', squats: 20, lunges: 15, bridges: 10 },
    { name: 'Week 2', squats: 25, lunges: 18, bridges: 12 },
    { name: 'Week 3', squats: 30, lunges: 20, bridges: 15 },
    { name: 'Week 4', squats: 35, lunges: 25, bridges: 18 },
    { name: 'Week 5', squats: 40, lunges: 30, bridges: 22 },
    { name: 'Week 6', squats: 45, lunges: 32, bridges: 25 }
  ];

  // Sample pain reduction data
  const painData = [
    { name: 'Jan', level: 8 },
    { name: 'Feb', level: 7 },
    { name: 'Mar', level: 6 },
    { name: 'Apr', level: 5 },
    { name: 'May', level: 4 },
    { name: 'Jun', level: 3 }
  ];

  // Sample AI goals
  const weeklyGoals = [
    { id: 1, goal: "Increase squats by 5 reps per session", progress: 80 },
    { id: 2, goal: "Achieve 15 minutes of stretching daily", progress: 65 },
    { id: 3, goal: "Improve knee flexion range by 5 degrees", progress: 90 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Muscle Development Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Dumbbell className="h-5 w-5 mr-2 text-primary" />
              Muscle Development Progress
            </CardTitle>
            <CardDescription>
              Track your muscle strength and development over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="muscles" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="muscles">Muscle Groups</TabsTrigger>
                <TabsTrigger value="progress">Progress Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="muscles" className="space-y-4">
                <div className="grid gap-2">
                  {muscleGroups.map((muscle) => (
                    <div key={muscle.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{muscle.name}</span>
                        <span className="text-sm">{muscle.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${muscle.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="progress">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="strength" 
                        stroke="#2563eb" 
                        strokeWidth={2} 
                        dot={{ strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Strength"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="flexibility" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Flexibility"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="endurance" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Endurance"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-4 mt-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#2563eb] mr-1.5"></div>
                    <span>Strength</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#10b981] mr-1.5"></div>
                    <span>Flexibility</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-1.5"></div>
                    <span>Endurance</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Exercise Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Exercise Performance
            </CardTitle>
            <CardDescription>
              Weekly exercise repetitions and intensity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Repetitions', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="squats" fill="#8884d8" name="Squats" />
                  <Bar dataKey="lunges" fill="#82ca9d" name="Lunges" />
                  <Bar dataKey="bridges" fill="#ffc658" name="Bridges" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Last Session Notes</h4>
              <p className="text-sm text-muted-foreground">
                Completed full routine with increased resistance. Form improved on squats, 
                but still needs attention on proper knee alignment during lunges.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pain Reduction Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Pain Reduction Progress
            </CardTitle>
            <CardDescription>
              Monthly pain level assessment (scale: 0-10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={painData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Pain Level" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Starting level:</span> 8/10
              </div>
              <div className="text-sm">
                <span className="font-medium">Current level:</span> 3/10
              </div>
              <div className="text-sm text-green-600 font-medium">
                -62.5% Improvement
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Goals Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              AI-Generated Weekly Goals
            </CardTitle>
            <CardDescription>
              Personalized goals based on your progress and condition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyGoals.map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{goal.goal}</span>
                    <span className="text-sm">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        goal.progress > 80 ? 'bg-green-500' : 
                        goal.progress > 50 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Doctor Recommendations</h4>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  "Continue with current exercise program. Focus on maintaining good form rather 
                  than increasing repetitions. Consider adding water therapy once per week."
                </p>
                <p className="text-xs text-blue-600 mt-2">- Dr. Sarah Johnson, Last updated: June 12, 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTracking;
