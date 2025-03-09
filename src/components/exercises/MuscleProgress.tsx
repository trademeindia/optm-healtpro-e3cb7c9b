import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { MuscleGroup, ProgressData } from '@/types/exercise.types';

interface MuscleProgressProps {
  muscleGroups: MuscleGroup[];
  progressData: ProgressData[];
}

const MuscleProgress: React.FC<MuscleProgressProps> = ({
  muscleGroups,
  progressData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Muscle Development & Progress</CardTitle>
        <CardDescription>
          Track your muscle development and exercise progress over time
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
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
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
  );
};

export default MuscleProgress;
