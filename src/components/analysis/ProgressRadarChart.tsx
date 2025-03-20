
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

const ProgressRadarChart: React.FC = () => {
  // Mock data for the radar chart
  const data = [
    { metric: 'VCS', value: 76, fullMark: 100 },
    { metric: 'Knee Extension', value: 88, fullMark: 100 },
    { metric: 'ROM', value: 82, fullMark: 100 },
    { metric: 'force', value: 70, fullMark: 100 },
    { metric: 'scapular', value: 65, fullMark: 100 },
    { metric: 'ECF', value: 73, fullMark: 100 },
    { metric: 'cerv', value: 88, fullMark: 100 },
    { metric: 'impact', value: 60, fullMark: 100 },
    { metric: 'control', value: 75, fullMark: 100 },
    { metric: 'vf/p', value: 45, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart outerRadius="80%" data={data}>
        <PolarGrid strokeDasharray="3 3" stroke="#d1d5db" />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
        <Radar 
          name="Current Assessment" 
          dataKey="value" 
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.5} 
        />
        <Tooltip />
        <Legend wrapperStyle={{ bottom: 0 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ProgressRadarChart;
