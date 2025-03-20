
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Radar, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import ProgressRadarChart from './ProgressRadarChart';
import TreatmentRecommendations from './TreatmentRecommendations';
import MuscleImprovementChart from './MuscleImprovementChart';

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
      vcs: { value: 76.8, change: 0, unit: '%', previous: 76.8 },
      jht: { value: 27.4, change: -0.2, unit: 's', previous: 27.6 },
      rom: { value: 82, change: 5, unit: 'deg', previous: 77 },
      force: { value: 19.0, change: 2.1, unit: 'kg', previous: 16.9 },
      anatomical: {
        'Cervical Extension/Flexion (ECF)': { value: 73.5, change: 0.2, unit: '%', previous: 73.3 },
        'Cervical Circumference (CC)': { value: 38.1, change: 1.8, unit: 'cm', previous: 36.3 },
        'Scapulothoracic Angle (STA)': { value: 34.3, change: 1.1, unit: 'deg', previous: 33.2 }
      },
      mobility: {
        'Shoulder Flexion': { value: 165, change: 8, unit: 'deg', previous: 157 },
        'Knee Extension Range': { value: 140, change: 15, unit: 'deg', previous: 125 },
        'Active TFL Angle': { value: 38.2, change: 3.2, unit: 'deg', previous: 35.0 }
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
                
                {/* Visualization for before/after comparison */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Before vs After Comparison</h4>
                  <div className="rounded-lg border p-4 bg-card">
                    <MuscleImprovementChart metrics={patientData.metrics} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Biomarkers</h4>
                    <ul className="space-y-3">
                      {Object.entries({
                        'VCS': patientData.metrics.vcs,
                        'JHT': patientData.metrics.jht,
                        'ROM': patientData.metrics.rom,
                        'Force': patientData.metrics.force
                      }).map(([key, metric]) => (
                        <li key={key} className="bg-background rounded-md p-3 border">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{key}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 text-sm">{metric.previous} {metric.unit}</span>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                              <span className="font-semibold">{metric.value} {metric.unit}</span>
                              {metric.change !== 0 && (
                                <Badge variant={metric.change > 0 ? "default" : "destructive"} className={`ml-2 text-xs ${metric.change > 0 ? "bg-green-500 hover:bg-green-600" : ""}`}>
                                  {metric.change > 0 ? '+' : ''}{metric.change} {metric.unit}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={(metric.value / 100) * 100} 
                            className="h-2"
                            // Add a different style based on improvement
                            indicatorClassName={metric.change > 0 ? "bg-green-500" : 
                                               metric.change < 0 ? "bg-red-500" : "bg-amber-500"}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Anatomical</h4>
                    <ul className="space-y-3">
                      {Object.entries(patientData.metrics.anatomical).map(([key, metric]) => (
                        <li key={key} className="bg-background rounded-md p-3 border">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{key}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 text-sm">{metric.previous} {metric.unit}</span>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                              <span className="font-semibold">{metric.value} {metric.unit}</span>
                              {metric.change !== 0 && (
                                <Badge variant={metric.change > 0 ? "default" : "destructive"} className={`ml-2 text-xs ${metric.change > 0 ? "bg-green-500 hover:bg-green-600" : ""}`}>
                                  {metric.change > 0 ? '+' : ''}{metric.change} {metric.unit}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${metric.change > 0 ? "bg-green-500" : metric.change < 0 ? "bg-red-500" : "bg-amber-500"}`}
                                style={{ width: `${Math.min(100, Math.max(0, (metric.value / (metric.value * 1.5)) * 100))}%` }}
                              ></div>
                            </div>
                            {metric.change > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : metric.change < 0 ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Mobility</h4>
                    <ul className="space-y-3">
                      {Object.entries(patientData.metrics.mobility).map(([key, metric]) => (
                        <li key={key} className="bg-background rounded-md p-3 border">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{key}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 text-sm">{metric.previous} {metric.unit}</span>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                              <span className="font-semibold">{metric.value} {metric.unit}</span>
                              {metric.change !== 0 && (
                                <Badge variant={metric.change > 0 ? "default" : "destructive"} className={`ml-2 text-xs ${metric.change > 0 ? "bg-green-500 hover:bg-green-600" : ""}`}>
                                  {metric.change > 0 ? '+' : ''}{metric.change} {metric.unit}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${metric.change > 0 ? "bg-green-500" : metric.change < 0 ? "bg-red-500" : "bg-amber-500"}`}
                                style={{ width: `${Math.min(100, Math.max(0, (metric.value / 180) * 100))}%` }}
                              ></div>
                            </div>
                            {metric.change > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : metric.change < 0 ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : null}
                          </div>
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

