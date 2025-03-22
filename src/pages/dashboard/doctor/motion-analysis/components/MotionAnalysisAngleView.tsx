import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { JointAngle } from './MotionAnalysisRecorder';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface MotionAnalysisAngleViewProps {
  jointAngles: JointAngle[];
  targetJoints: string[];
  duration: number;
}

interface ChartDataPoint {
  timeInSeconds: number;
  [key: string]: number;
}

const COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // amber
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#6366F1", // indigo
  "#14B8A6", // teal
];

const MotionAnalysisAngleView: React.FC<MotionAnalysisAngleViewProps> = ({
  jointAngles,
  targetJoints,
  duration
}) => {
  const [selectedJoint, setSelectedJoint] = React.useState<string | null>(null);
  const [timeWindow, setTimeWindow] = React.useState<number>(duration > 0 ? duration : 30);
  
  // Get unique joint names from the data
  const uniqueJoints = useMemo(() => {
    return Array.from(new Set(jointAngles.map(angle => angle.jointName)));
  }, [jointAngles]);
  
  // Set default selected joint if none is selected
  React.useEffect(() => {
    if (uniqueJoints.length > 0 && !selectedJoint) {
      setSelectedJoint(uniqueJoints[0]);
    }
  }, [uniqueJoints, selectedJoint]);
  
  // Format data for the chart
  const chartData = useMemo(() => {
    if (jointAngles.length === 0) return [];
    
    // Find the starting timestamp
    const startTime = jointAngles.reduce((min, angle) => 
      angle.timestamp < min ? angle.timestamp : min, 
      jointAngles[0].timestamp
    );
    
    // Group data by timestamp
    const dataByTime: { [key: number]: ChartDataPoint } = {};
    
    jointAngles.forEach(angle => {
      const timeInSeconds = Math.floor((angle.timestamp - startTime) / 1000);
      
      if (!dataByTime[timeInSeconds]) {
        dataByTime[timeInSeconds] = { timeInSeconds };
      }
      
      dataByTime[timeInSeconds][angle.jointName] = angle.angle;
    });
    
    // Convert to array and sort by time
    return Object.values(dataByTime).sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  }, [jointAngles]);
  
  // Filter data for the chart based on time window
  const filteredChartData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    // If duration is less than time window, show all data
    if (duration <= timeWindow) return chartData;
    
    // Otherwise, show the last [timeWindow] seconds of data
    const lastTime = chartData[chartData.length - 1].timeInSeconds;
    const startTime = lastTime - timeWindow;
    
    return chartData.filter(point => point.timeInSeconds >= startTime);
  }, [chartData, timeWindow, duration]);
  
  // Calculate statistics for each joint
  const jointStats = useMemo(() => {
    const stats: Record<string, { min: number; max: number; avg: number; range: number }> = {};
    
    uniqueJoints.forEach(joint => {
      const angles = jointAngles
        .filter(angle => angle.jointName === joint)
        .map(angle => angle.angle);
      
      if (angles.length > 0) {
        const min = Math.min(...angles);
        const max = Math.max(...angles);
        const avg = angles.reduce((sum, angle) => sum + angle, 0) / angles.length;
        
        stats[joint] = {
          min: Math.round(min),
          max: Math.round(max),
          avg: Math.round(avg),
          range: Math.round(max - min)
        };
      }
    });
    
    return stats;
  }, [jointAngles, uniqueJoints]);
  
  // Handle no data case
  if (jointAngles.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">No Data Available</h3>
        <p className="text-muted-foreground">
          Start recording to collect joint angle data for analysis
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <Label htmlFor="jointSelect" className="mb-2 block">Select Joint</Label>
          <Select
            value={selectedJoint || ''}
            onValueChange={(value) => setSelectedJoint(value)}
          >
            <SelectTrigger id="jointSelect" className="w-[180px]">
              <SelectValue placeholder="Select a joint" />
            </SelectTrigger>
            <SelectContent>
              {uniqueJoints.map((joint, index) => (
                <SelectItem key={joint} value={joint}>
                  {joint} {targetJoints.includes(joint) && '(targeted)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="timeWindow" className="mb-2 block">Time Window (seconds)</Label>
          <Select
            value={timeWindow.toString()}
            onValueChange={(value) => setTimeWindow(parseInt(value))}
          >
            <SelectTrigger id="timeWindow" className="w-[180px]">
              <SelectValue placeholder="Select time window" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="120">2 minutes</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
              <SelectItem value="600">10 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timeInSeconds" 
              label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -5 }} 
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              label={{ value: 'Angle (degrees)', angle: -90, position: 'insideLeft' }} 
              domain={[0, 180]}
            />
            <Tooltip formatter={(value) => [`${Math.round(value as number)}°`]} />
            <Legend />
            {selectedJoint ? (
              <Line
                type="monotone"
                dataKey={selectedJoint}
                stroke={COLORS[0]}
                strokeWidth={2}
                dot={{ r: 1 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
                name={selectedJoint}
              />
            ) : (
              uniqueJoints.map((joint, index) => (
                <Line
                  key={joint}
                  type="monotone"
                  dataKey={joint}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                  name={joint}
                />
              ))
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniqueJoints.map((joint, index) => {
          const stats = jointStats[joint];
          if (!stats) return null;
          
          return (
            <Card key={joint}>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {joint}
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min:</span>
                    <span className="font-medium">{stats.min}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max:</span>
                    <span className="font-medium">{stats.max}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg:</span>
                    <span className="font-medium">{stats.avg}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Range:</span>
                    <span className="font-medium">{stats.range}°</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MotionAnalysisAngleView;
