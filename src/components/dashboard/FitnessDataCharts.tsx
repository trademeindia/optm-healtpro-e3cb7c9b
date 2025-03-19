
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { format } from 'date-fns';

interface FitnessDataChartsProps {
  fitnessData: FitnessData;
  className?: string;
}

const FitnessDataCharts: React.FC<FitnessDataChartsProps> = ({ fitnessData, className }) => {
  // Format data for step chart
  const stepChartData = fitnessData.steps.data.map(item => ({
    date: format(new Date(item.timestamp), 'EEE'),
    steps: item.value
  }));

  // Format data for heart rate chart
  const heartRateData = fitnessData.heartRate.data.map(item => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    bpm: item.value
  }));

  // Format data for calories chart
  const calorieData = fitnessData.calories.data.map(item => ({
    date: format(new Date(item.timestamp), 'EEE'),
    calories: item.value
  }));

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Steps Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Steps</CardTitle>
            <CardDescription>
              Your step activity over the last week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {stepChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stepChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="steps" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No step data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Heart Rate</CardTitle>
            <CardDescription>
              Your heart rate over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {heartRateData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No heart rate data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calories Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daily Calories Burned</CardTitle>
          <CardDescription>
            Estimated calories burned over the last week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {calorieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No calorie data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FitnessDataCharts;
