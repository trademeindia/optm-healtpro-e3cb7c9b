
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  Legend
} from 'recharts';

interface EnhancedBiologicalAgeMeterProps {
  biologicalAge: number;
  chronologicalAge: number;
  className?: string;
}

const EnhancedBiologicalAgeMeter: React.FC<EnhancedBiologicalAgeMeterProps> = ({ 
  biologicalAge,
  chronologicalAge,
  className
}) => {
  const ageDifference = chronologicalAge - biologicalAge;
  const yearsYounger = ageDifference > 0;
  
  // Calculate health score from 0-100 based on the difference
  // If biological age is lower than chronological age, that's good
  const healthScore = Math.min(100, Math.max(0, 50 + (ageDifference * 5)));
  
  // Data for the radial chart
  const data = [
    {
      name: 'Health Score',
      value: healthScore,
      fill: healthScore >= 80 ? '#22c55e' : 
            healthScore >= 60 ? '#84cc16' : 
            healthScore >= 40 ? '#eab308' : 
            healthScore >= 20 ? '#f97316' : '#ef4444',
    },
  ];
  
  // Get health status text based on health score
  const getHealthStatus = () => {
    if (healthScore >= 80) return { text: 'Excellent', color: 'text-green-500' };
    if (healthScore >= 60) return { text: 'Good', color: 'text-lime-500' };
    if (healthScore >= 40) return { text: 'Fair', color: 'text-yellow-500' };
    if (healthScore >= 20) return { text: 'Poor', color: 'text-orange-500' };
    return { text: 'Critical', color: 'text-red-500' };
  };
  
  const healthStatus = getHealthStatus();
  
  // Age comparison factors
  const factors = [
    { name: 'Cardiovascular Health', score: Math.round(healthScore * 0.9) },
    { name: 'Metabolic Efficiency', score: Math.round(healthScore * 1.1) },
    { name: 'Cellular Regeneration', score: Math.round(healthScore * 0.95) },
    { name: 'Inflammation Levels', score: Math.round(healthScore * 1.05) }
  ];
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          Biological Age Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="100%" 
                barSize={10} 
                data={data}
                startAngle={180} 
                endAngle={0}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: '#f1f5f9' }}
                  dataKey="value"
                  cornerRadius={12}
                  label={{ position: 'center', fill: '#64748b', fontSize: 20, fontWeight: 'bold' }}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="radial-chart-text"
                  style={{ fontSize: '26px', fontWeight: 'bold', fill: data[0].fill }}
                >
                  {healthScore}
                </text>
                <text
                  x="50%"
                  y="62%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="radial-chart-subtext"
                  style={{ fontSize: '12px', fill: '#64748b' }}
                >
                  HEALTH SCORE
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2 text-center">
            <h3 className="text-lg font-bold flex items-center justify-center gap-1">
              {biologicalAge} <span className="text-muted-foreground text-sm">vs</span> {chronologicalAge}
            </h3>
            <p className="text-sm text-muted-foreground">Biological vs Chronological Age</p>
            
            <p className="mt-3 font-semibold">
              Your body is functioning like {' '}
              <span className={yearsYounger ? 'text-green-500' : 'text-amber-500'}>
                {yearsYounger ? 'someone younger' : 'someone older'}
              </span>
            </p>
            
            <p className="text-sm text-muted-foreground">
              {yearsYounger
                ? `You're ${Math.abs(ageDifference)} years younger biologically!`
                : `You're ${Math.abs(ageDifference)} years older biologically.`}
            </p>
            
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Health Status: <span className={healthStatus.color}>{healthStatus.text}</span></p>
              
              <div className="space-y-3">
                {factors.map((factor, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span>{factor.name}</span>
                      <span>{factor.score}%</span>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedBiologicalAgeMeter;
