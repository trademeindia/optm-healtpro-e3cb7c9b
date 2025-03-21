
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExerciseMetric {
  name: string;
  value: number;
  fill: string;
}

interface ExerciseMetricsChartProps {
  data: ExerciseMetric[];
  title: string;
  height?: number;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-2 text-xs">
        <p className="font-semibold">{label}</p>
        <p className="text-muted-foreground">
          Value: <span className="font-medium text-foreground">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

const ExerciseMetricsChart: React.FC<ExerciseMetricsChartProps> = ({ 
  data, 
  title,
  height = 300
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              style={{ fontSize: '0.75rem' }} 
              stroke="currentColor"
              tickLine={false}
            />
            <YAxis 
              style={{ fontSize: '0.75rem' }} 
              stroke="currentColor"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="var(--color)" 
              radius={[4, 4, 0, 0]} 
              className="fill-primary"
              style={{ '--color': 'hsl(var(--primary))' } as React.CSSProperties}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExerciseMetricsChart;
