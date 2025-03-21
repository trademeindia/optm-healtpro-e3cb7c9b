
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MuscleGroup, ProgressData } from '@/types/exercise.types';
import { BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MuscleProgressProps {
  muscleGroups: MuscleGroup[];
  progressData: ProgressData[];
}

const MuscleProgress: React.FC<MuscleProgressProps> = ({ muscleGroups, progressData }) => {
  // Sort muscle groups by progress (highest first)
  const sortedMuscleGroups = [...muscleGroups].sort((a, b) => b.progress - a.progress);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            <span>Progress Overview</span>
          </CardTitle>
          <CardDescription>
            Weekly exercise stats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={progressData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" fontSize={10} tickMargin={5} />
                <YAxis fontSize={10} tickFormatter={(value) => `${value}%`} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="strength" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="flexibility" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="endurance" 
                  stackId="1"
                  stroke="#ffc658" 
                  fill="#ffc658" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Muscle Group Progress</CardTitle>
          <CardDescription>
            Progress for targeted areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedMuscleGroups.map((muscle) => (
              <div key={muscle.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{muscle.name}</span>
                  <span className="text-xs font-medium">{muscle.progress}%</span>
                </div>
                <Progress value={muscle.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MuscleProgress;
