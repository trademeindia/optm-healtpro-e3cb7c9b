
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { sleepStageNames, sleepStageColors } from './sleepUtils';

interface SleepStagesChartProps {
  sleepStages: any[];
}

const SleepStagesChart: React.FC<SleepStagesChartProps> = ({ sleepStages }) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Sleep Stages</h4>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sleepStages} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString([], { weekday: 'short' });
              }}
            />
            <YAxis 
              fontSize={12}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip 
              formatter={(value: any, name: any) => {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                const stageName = sleepStageNames[parseInt(name)] || name;
                return [`${hours}h ${minutes}m`, stageName];
              }}
              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
            />
            <Legend 
              formatter={(value) => {
                const stageNumber = parseInt(value);
                return sleepStageNames[stageNumber] || value;
              }}
            />
            {Object.keys(sleepStageNames).map((stageNumber) => (
              <Bar 
                key={stageNumber}
                dataKey={stageNumber}
                stackId="a"
                fill={sleepStageColors[parseInt(stageNumber)]}
                name={stageNumber}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SleepStagesChart;
