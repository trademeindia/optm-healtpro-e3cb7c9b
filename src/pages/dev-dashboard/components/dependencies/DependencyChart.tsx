
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartPieIcon } from 'lucide-react';

interface DependencyChartProps {
  totalCount: number;
  devCount: number;
  outdatedCount: number;
  vulnerableCount: number;
}

const DependencyChart: React.FC<DependencyChartProps> = ({
  totalCount,
  devCount,
  outdatedCount,
  vulnerableCount
}) => {
  const prodCount = totalCount - devCount;
  const upToDateCount = totalCount - outdatedCount - vulnerableCount;
  
  const data = [
    { name: 'Production', value: prodCount, color: '#60a5fa', type: 'type' },
    { name: 'Development', value: devCount, color: '#c4b5fd', type: 'type' },
    { name: 'Up-to-date', value: upToDateCount, color: '#34d399', type: 'status' },
    { name: 'Outdated', value: outdatedCount, color: '#fbbf24', type: 'status' },
    { name: 'Vulnerable', value: vulnerableCount, color: '#f87171', type: 'status' }
  ];
  
  const typeData = data.filter(item => item.type === 'type');
  const statusData = data.filter(item => item.type === 'status');
  
  const chartConfig = {
    prod: { color: '#60a5fa' },
    dev: { color: '#c4b5fd' },
    upToDate: { color: '#34d399' },
    outdated: { color: '#fbbf24' },
    vulnerable: { color: '#f87171' }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <ChartPieIcon className="h-5 w-5 mr-2 text-rose-500" />
          Dependencies Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[220px]"
        >
          <ChartContainer config={chartConfig} className="h-full">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={35}
                      fill="#8884d8"
                      label
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      fill="#82ca9d"
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4">
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </div>
            </div>
          </ChartContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default DependencyChart;
