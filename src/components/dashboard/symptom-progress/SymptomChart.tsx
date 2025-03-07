
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainerProps } from './types';

const SymptomChart: React.FC<ChartContainerProps> = ({ symptoms, chartData }) => {
  return (
    <div className="h-60 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={chartData} 
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{
              fontSize: 12
            }} 
          />
          <YAxis 
            domain={[0, 10]} 
            tickCount={6} 
            tick={{
              fontSize: 12
            }} 
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }} 
            labelStyle={{
              fontWeight: 'bold',
              marginBottom: '4px'
            }} 
          />
          <Legend 
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '10px'
            }} 
          />
          
          {symptoms.map(symptom => (
            <Line 
              key={symptom.symptomName} 
              type="monotone" 
              dataKey={symptom.symptomName} 
              stroke={symptom.color} 
              strokeWidth={2} 
              dot={{
                r: 3
              }} 
              activeDot={{
                r: 5,
                strokeWidth: 0
              }} 
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SymptomChart;
