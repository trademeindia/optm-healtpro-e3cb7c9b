import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Radar } from 'lucide-react';
import ProgressRadarChart from './ProgressRadarChart';
import TreatmentRecommendations from './TreatmentRecommendations';

const PatientAnalysisReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summary');
  
  const patientData = {
    name: 'John Smith',
    age: 42,
    gender: 'male',
    treatmentStage: 'intermediate',
    overallProgress: {
      status: 'minimal-improvement',
      percentChange: 25,
      description: 'John Smith shows minimal improvement (+25%) at most metrics during the intermediate treatment stage. Treatment protocol may need adjustment to improve outcomes.'
    },
    assessments: {
      current: {
        date: '9/15/2023',
      },
      previous: {
        date: '6/20/2023',
      }
    },
    metrics: {
      vcs: { value: 76.8, change: 0, unit: '%' },
      jht: { value: 27.4, change: -0.2, unit: 's' },
      rom: { value: 82, change: 5, unit: 'deg' },
      force: { value: 19.0, change: 2.1, unit: 'kg' },
      anatomical: {
        'Cervical Extension/Flexion (ECF)': { value: 73.5, change: 0.2, unit: '%' },
        'Cervical Circumference (CC)': { value: 38.1, change: 1.8, unit: 'cm' },
        'Scapulothoracic Angle (STA)': { value: 34.3, change: 1.1, unit: 'deg' }
      },
      mobility: {
        'Shoulder Flexion': { value: 165, change: 8, unit: 'deg' },
        'Knee Extension Range': { value: 140, change: 15, unit: 'deg' },
        'Active TFL Angle': { value: 38.2, change: 3.2, unit: 'deg' }
      }
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {patientData.name}
                <span className="text-sm font-normal text-muted-foreground">
                  {patientData.age} years, {patientData.gender}, {patientData.treatmentStage} treatment stage
                </span>
              </h2>
              <h3 className="text-lg font-semibold mt-2">Overall Progress</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Last Updated: <span className="font-medium">{patientData.assessments.current.date}</span></div>
              <div>Previous assessment: <span className="font-medium">{patientData.assessments.previous.date}</span></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={patientData.overallProgress.status === 'minimal-improvement' ? 'secondary' : 'default'} className="py-1">
                {patientData.overallProgress.status === 'minimal-improvement' ? 'No change/ improvement' : 'Improvement'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{patientData.overallProgress.description}</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <span>Summary</span>
            </TabsTrigger>
            <TabsTrigger value="biomarkers" className="flex items-center gap-2">
              <span>Biomarkers</span>
            </TabsTrigger>
            <TabsTrigger value="anatomical" className="flex items-center gap-2">
              <span>Anatomical</span>
            </TabsTrigger>
            <TabsTrigger value="mobility" className="flex items-center gap-2">
              <span>Mobility</span>
            </TabsTrigger>
            <TabsTrigger value="imaging" className="flex items-center gap-2">
              <span>Imaging</span>
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Metrics Overview</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Biomarkers</h4>
                    <ul className="space-y-2">
                      {Object.entries({
                        'VCS': patientData.metrics.vcs,
                        'JHT': patientData.metrics.jht,
                        'ROM': patientData.metrics.rom,
                        'Force': patientData.metrics.force
                      }).map(([key, metric]) => (
                        <li key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${metric.change > 0 ? 'bg-green-500' : metric.change < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <span>{key}</span>
                          </div>
                          <span className="font-medium">{metric.value} {metric.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Anatomical</h4>
                    <ul className="space-y-2">
                      {Object.entries(patientData.metrics.anatomical).map(([key, metric]) => (
                        <li key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${metric.change > 0 ? 'bg-green-500' : metric.change < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-sm">{key}</span>
                          </div>
                          <span className="font-medium">{metric.value} {metric.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Mobility</h4>
                    <ul className="space-y-2">
                      {Object.entries(patientData.metrics.mobility).map(([key, metric]) => (
                        <li key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${metric.change > 0 ? 'bg-green-500' : metric.change < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-sm">{key}</span>
                          </div>
                          <span className="font-medium">{metric.value} {metric.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Treatment Recommendations</h3>
                <TreatmentRecommendations />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Progress Overview
                <span className="text-sm font-normal text-muted-foreground">Comparison of progress across all metrics</span>
              </h3>
              <div className="h-80 w-full">
                <ProgressRadarChart />
              </div>
            </div>
          </TabsContent>
          
          {/* Other tabs content */}
          <TabsContent value="biomarkers" className="space-y-4">
            <div className="p-12 text-center text-muted-foreground">
              <AreaChart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium">Biomarkers Detail View</h3>
              <p className="max-w-md mx-auto mt-2">
                Detailed biomarker analysis will be displayed here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="anatomical" className="space-y-4">
            <div className="p-12 text-center text-muted-foreground">
              <AreaChart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium">Anatomical Measurements</h3>
              <p className="max-w-md mx-auto mt-2">
                Detailed anatomical measurements will be displayed here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="mobility" className="space-y-4">
            <div className="p-12 text-center text-muted-foreground">
              <AreaChart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium">Mobility Assessment</h3>
              <p className="max-w-md mx-auto mt-2">
                Detailed mobility assessment will be displayed here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="imaging" className="space-y-4">
            <div className="p-12 text-center text-muted-foreground">
              <AreaChart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium">Imaging Results</h3>
              <p className="max-w-md mx-auto mt-2">
                Imaging results and analysis will be displayed here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PatientAnalysisReport;
