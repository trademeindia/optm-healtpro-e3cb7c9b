import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Activity, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
interface SymptomData {
  name: string;
  date: string;
  value: number;
}
interface ChartData {
  symptomName: string;
  color: string;
  data: SymptomData[];
}
interface SymptomProgressChartProps {
  className?: string;
}
const SymptomProgressChart: React.FC<SymptomProgressChartProps> = ({
  className
}) => {
  // Mock data for symptom tracking over time
  const symptoms: ChartData[] = [{
    symptomName: 'Shoulder Pain',
    color: '#FF8787',
    data: [{
      name: 'Jun 1',
      date: '2023-06-01',
      value: 8
    }, {
      name: 'Jun 3',
      date: '2023-06-03',
      value: 7
    }, {
      name: 'Jun 5',
      date: '2023-06-05',
      value: 7
    }, {
      name: 'Jun 7',
      date: '2023-06-07',
      value: 6
    }, {
      name: 'Jun 9',
      date: '2023-06-09',
      value: 5
    }, {
      name: 'Jun 11',
      date: '2023-06-11',
      value: 4
    }, {
      name: 'Jun 13',
      date: '2023-06-13',
      value: 3
    }, {
      name: 'Jun 15',
      date: '2023-06-15',
      value: 2
    }]
  }, {
    symptomName: 'Back Pain',
    color: '#5D5FEF',
    data: [{
      name: 'Jun 1',
      date: '2023-06-01',
      value: 3
    }, {
      name: 'Jun 3',
      date: '2023-06-03',
      value: 4
    }, {
      name: 'Jun 5',
      date: '2023-06-05',
      value: 5
    }, {
      name: 'Jun 7',
      date: '2023-06-07',
      value: 5
    }, {
      name: 'Jun 9',
      date: '2023-06-09',
      value: 4
    }, {
      name: 'Jun 11',
      date: '2023-06-11',
      value: 3
    }, {
      name: 'Jun 13',
      date: '2023-06-13',
      value: 2
    }, {
      name: 'Jun 15',
      date: '2023-06-15',
      value: 1
    }]
  }, {
    symptomName: 'Headache',
    color: '#F97316',
    data: [{
      name: 'Jun 1',
      date: '2023-06-01',
      value: 2
    }, {
      name: 'Jun 3',
      date: '2023-06-03',
      value: 3
    }, {
      name: 'Jun 5',
      date: '2023-06-05',
      value: 6
    }, {
      name: 'Jun 7',
      date: '2023-06-07',
      value: 4
    }, {
      name: 'Jun 9',
      date: '2023-06-09',
      value: 2
    }, {
      name: 'Jun 11',
      date: '2023-06-11',
      value: 0
    }, {
      name: 'Jun 13',
      date: '2023-06-13',
      value: 1
    }, {
      name: 'Jun 15',
      date: '2023-06-15',
      value: 0
    }]
  }];

  // Combined data for the chart
  const chartData = symptoms[0].data.map((item, index) => {
    const dataPoint: any = {
      name: item.name
    };
    symptoms.forEach(symptom => {
      dataPoint[symptom.symptomName] = symptom.data[index].value;
    });
    return dataPoint;
  });

  // Calculate average pain reduction
  const calculatePainReduction = () => {
    const reductions = symptoms.map(symptom => {
      const firstValue = symptom.data[0].value;
      const lastValue = symptom.data[symptom.data.length - 1].value;
      return (firstValue - lastValue) / firstValue * 100;
    });
    const avgReduction = reductions.reduce((sum, value) => sum + value, 0) / reductions.length;
    return Math.round(avgReduction);
  };
  const painReduction = calculatePainReduction();
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="my-[127px]">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg font-semibold">Symptom Progress</h3>
          <p className="text-sm text-muted-foreground">
            Track improvement of symptoms over time
          </p>
        </div>
        <Activity className="w-5 h-5 text-primary" />
      </div>
      
      <div className="mb-4 p-3 bg-secondary/30 rounded-lg flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-medical-green/20 flex items-center justify-center">
          <TrendingDown className="w-5 h-5 text-medical-green" />
        </div>
        <div>
          <div className="font-medium">Overall Pain Reduction</div>
          <div className="text-2xl font-bold text-medical-green">{painReduction}%</div>
        </div>
      </div>
      
      <div className="h-60 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0
        }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{
            fontSize: 12
          }} />
            <YAxis domain={[0, 10]} tickCount={6} tick={{
            fontSize: 12
          }} />
            <Tooltip contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '12px'
          }} labelStyle={{
            fontWeight: 'bold',
            marginBottom: '4px'
          }} />
            <Legend wrapperStyle={{
            fontSize: '12px',
            paddingTop: '10px'
          }} />
            
            {symptoms.map(symptom => <Line key={symptom.symptomName} type="monotone" dataKey={symptom.symptomName} stroke={symptom.color} strokeWidth={2} dot={{
            r: 3
          }} activeDot={{
            r: 5,
            strokeWidth: 0
          }} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {symptoms.map((symptom, index) => {
        const firstValue = symptom.data[0].value;
        const lastValue = symptom.data[symptom.data.length - 1].value;
        const reduction = (firstValue - lastValue) / firstValue * 100;
        return <div key={index} className="flex-1 min-w-[120px] bg-white/50 dark:bg-white/5 p-3 rounded-lg border border-border">
              <div className="text-sm font-medium mb-1">{symptom.symptomName}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold" style={{
              color: symptom.color
            }}>
                  {lastValue}
                </span>
                <span className="text-xs text-muted-foreground">/10</span>
              </div>
              <div className="flex items-center mt-1">
                <div className="text-xs bg-medical-green/20 text-medical-green px-1.5 py-0.5 rounded-full">
                  ↓ {Math.round(reduction)}%
                </div>
              </div>
            </div>;
      })}
      </div>
    </motion.div>;
};
export default SymptomProgressChart;